import { Repository } from "typeorm";
import BookRepository from "../repositories/book.repository";
import { Book } from "../entities/book.entity";
import httpException from "../exceptions/http.exception";
import { LoggerService } from "./logger.service";
import { Author } from "../entities/author.entity";
import { Genre } from "../entities/genre.entity";
import { auditLogRepository, auditLogService } from "../routes/audit.route";
import { Review } from "../entities/review.entity";
import datasource from "../db/data-source";
import { OpenLibraryBook } from "../types/open-library-book-response.type";
import { AuditLogType, EntityType } from "../entities/enums";
import { UpdateBookDTO } from "../dto/books/update-book.dto";
import { authorService } from "../routes/author.route";
import { genreService } from "../routes/genre.route";
import AuthorRepository from "../repositories/author.repository";
import GenreRepository from "../repositories/genre.repository";
import { CellValue, Workbook } from "exceljs";
import setupWorksheet from "../utils/setupWorksheet";
import { parseItems } from "../utils/bulkUpload";
import ShelfRepository from "../repositories/shelf.repository";
import { BookCopy } from "../entities/bookcopy.entity";
import BookCopyRepository from "../repositories/book-copies.repository";
import { BulkUploadError, BulkUploadErrorDto } from "../dto/bulkupload/create-bulkupload.dto";
import { borrowRepository } from "../routes/borrow.route";

interface BookUploadResult {
    totalRows: number;
    successCount: number;
    failedCount: number;
    errors: BulkError[];
}

interface ParsedBookData {
  rowNum: number;
  isbn: string;
  title: string;
  description: string;
  cover_image: string;
  authors: string[];
  genres: string[];
  shelfLabels: string[];
}

interface BulkError {
    row: number;
    errors: string[];
}

class BookService {
  private entityManager = datasource.manager;
  private logger = LoggerService.getInstance(BookService.name);
  constructor(
    private bookRepository: BookRepository,
    private authorRepository: AuthorRepository,
    private genreRepository: GenreRepository,
    private shelfRepository: ShelfRepository,
    private bookCopyRepository: BookCopyRepository,
  ) {}

    async createBook(
        title: string,
        isbn: string,
        description: string,
        cover_image: string,
        authors: number[],
        genres: number[],
        user_id?: number
    ): Promise<Book> {
        const book = new Book();
        book.authors = await Promise.all(
            authors.map((author_id) => authorService.getAuthorByID(author_id))
        );
        book.title = title;
        book.cover_image = cover_image;
        book.description = description;
        book.isbn = isbn;
        book.genres = await Promise.all(
            genres.map((genre_id) => genreService.getGenreById(genre_id))
        );
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Book);
            const createdBook = await m.save(book);
            this.logger.info("Book Created");
            // throw new httpException(400, "qwerty");
            const error = await auditLogService.createAuditLog(
                AuditLogType.CREATE,
                user_id,
                createdBook.id.toString(),
                EntityType.BOOK,
                manager
            );
            if (error.error) {
                throw error.error;
            }
            return createdBook;
        });
    }

    async updateBook(
        id: number,
        updateData: Partial<UpdateBookDTO>,
        user_id: number
    ): Promise<void> {
        const book = await this.bookRepository.findOneByID(id);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }

        if (updateData.title !== undefined) book.title = updateData.title;
        if (updateData.isbn !== undefined) book.isbn = updateData.isbn;
        if (updateData.description !== undefined)
            book.description = updateData.description;
        if (updateData.cover_image !== undefined)
            book.cover_image = updateData.cover_image;

        if (updateData.authors !== undefined) {
            book.authors = await Promise.all(
                updateData.authors.map((author_id) =>
                    authorService.getAuthorByID(author_id)
                )
            );
        }
        if (updateData.genres !== undefined) {
            book.genres = await Promise.all(
                updateData.genres.map((genre_id) =>
                    genreService.getGenreById(genre_id)
                )
            );
        }
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Book);
            await m.save({ id, ...book });
            this.logger.info("Book Updated");
            const error = await auditLogService.createAuditLog(
                AuditLogType.UPDATE,
                user_id,
                id.toString(),
                EntityType.BOOK,
                manager
            );
            if (error.error) {
                throw error.error;
            }
        });
    }

    async deleteBookById(id: number, user_id: number): Promise<void> {
        const book = await this.bookRepository.findOneByID(id);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }
        if (book.copies.length !== 0) {
          this.logger.error("book has copies, cannot be deleted");
          throw new httpException(400, "Book has copies. Cannot be deleted");
        }
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Book);
            await m.delete({ id });
            this.logger.info("Book Deleted");
            const error = await auditLogService.createAuditLog(
                AuditLogType.DELETE,
                user_id,
                id.toString(),
                EntityType.BOOK,
                manager
            );
            if (error.error) {
                throw error.error;
            }
        });
    }

    async getAllBooks(): Promise<Book[]> {
        this.logger.info("Book Array Returned");
        const books = await this.bookRepository.findMany();

        return books;
    }

    async getBookById(id: number): Promise<Book> {
        const book = await this.bookRepository.findOneByID(id);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }
        if (book.copies.length !== 0) {
            const is_available = book.copies.some((copy) => copy.is_available);
            book.is_available = is_available;
            await this.bookRepository.update(id, book);
        }

        this.logger.info("Book returned");
        return this.bookRepository.findOneByID(id);
    }

    async getBookByISBN(isbn: string): Promise<Book> {
        const book = await this.bookRepository.findOnebyISBN(isbn);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }
        const is_available = book.copies.some((copy) => copy.is_available);
        book.is_available = is_available;
        await this.bookRepository.update(book.id, book);

        this.logger.info("Book returned");
        return book;
    }

  async createBookBulkTemplate(): Promise<Buffer> {
    const authors = await this.authorRepository.list();
    const genres = await this.genreRepository.list();
    const shelfLabels = await this.shelfRepository.list();

        const workbook = new Workbook();

    const templateSheet = setupWorksheet(workbook, {
      name: "Book Template",
      headers: [
        "ISBN",
        "Title",
        "Description",
        "Cover Image URL",
        "Authors (comma-separated)",
        "Genres (comma-separated)",
        "Shelf Labels (comma-separated)\nRepeat the label multiple times if multiple copies are to be placed on the same shelf"
      ],
      columnWidths: [15, 30, 30, 30, 50, 50, 60],
    });

    const dataSheet = setupWorksheet(workbook, {
      name: "Data Definitions",
      headers: ["Author Name", "Genre Name", "Shelf Labels"],
      columnWidths: [30, 30, 30],
    });

    const maxRows = Math.max(authors.length, genres.length, shelfLabels.length);
    const rows = [];
    for (let i = 0; i < maxRows; i++) {
      rows.push([
        i < authors.length ? authors[i].name : "",
        i < genres.length ? genres[i].name : "",
        i < shelfLabels.length ? shelfLabels[i].label : "",
      ]);
    }
    dataSheet.addRows(rows);

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async bulkUploadBooks(fileBuffer: Buffer, user_id: number) {
        const result: BookUploadResult = {
            totalRows: 0,
            successCount: 0,
            failedCount: 0,
            errors: [],
        };

        const workbook = new Workbook();
        await workbook.xlsx.load(fileBuffer);
        const worksheet = workbook.getWorksheet("Book Template");
        if (!worksheet) {
            throw new httpException(400, "Book Template worksheet not found");
        }

    const expectedHeaders = [
      "ISBN",
      "Title",
      "Description",
      "Cover Image URL",
      "Authors (comma-separated)",
      "Genres (comma-separated)",
      "Shelf Labels (comma-separated)\nRepeat the label multiple times if multiple copies are to be placed on the same shelf"
    ];


        const headerRow = worksheet.getRow(1);
        const actualHeaders = (headerRow.values as CellValue[]).slice(1);
        const headersMatch = expectedHeaders.every(
            (header, idx) => header === actualHeaders[idx]
        );
        if (!headersMatch) {
            throw new httpException(
                400,
                `Invalid headers found. Expected headers: ${expectedHeaders.join(
                    ", "
                )}`
            );
        }

        const books: ParsedBookData[] = [];
        const rowCount = worksheet.rowCount;
        result.totalRows = rowCount - 1;

        for (let rowNum = 2; rowNum <= rowCount; rowNum++) {
            try {
                const row = worksheet.getRow(rowNum);
                if (!row.hasValues) continue;

        const isbn = row.getCell(1).value;
        const title = row.getCell(2).value;
        const description = row.getCell(3).value;
        const cover_image = row.getCell(4).value;
        const authors = row.getCell(5).value;
        const genres = row.getCell(6).value;
        const shelfLabels = row.getCell(7).value;

        if (
          !isbn ||
          !title ||
          !description ||
          !cover_image ||
          !authors ||
          !genres ||
          !shelfLabels
        ) {
          throw new Error(
            `ISBN, Title, Description, Cover Image, Author(s), Genre(s) and Shelf Lable(s) are required`
          );
        }
        const parsedAuthors = parseItems(authors, `Row ${rowNum}: Authors`);
        const parsedGenres = parseItems(genres, `Row ${rowNum}: Genres`);
        const parsedShelfLabels = parseItems(shelfLabels, `Row ${rowNum}: Shelf Labels`);

        books.push({
          rowNum: rowNum,
          isbn: isbn.toString().trim(),
          title: title.toString().trim(),
          description: description.toString().trim(),
          cover_image: cover_image.toString().trim(),
          authors: parsedAuthors,
          genres: parsedGenres,
          shelfLabels: parsedShelfLabels
        });
      } catch (error) {
        result.errors.push({
          row: rowNum,
          errors: [error.message],
        });
        result.failedCount++;
      }
    }

        for (const bookData of books) {
            try {
                const existingBook =
                    await this.bookRepository.findPreviewByIsbn(bookData.isbn);
                if (existingBook) {
                    throw new Error(
                        `Book with ISBN ${bookData.isbn} already exists`
                    );
                }

                const authors = await this.authorRepository.findManyByName(
                    bookData.authors
                );
                if (authors.length !== bookData.authors.length) {
                    const foundNames = authors.map((a) => a.name);
                    const missingNames = bookData.authors.filter(
                        (name) => !foundNames.includes(name)
                    );
                    throw new Error(
                        `Authors not found: ${missingNames.join(", ")}`
                    );
                }

        const genres = await this.genreRepository.findManyByName(
          bookData.genres
        );
        if (genres.length !== bookData.genres.length) {
          const foundNames = genres.map((g) => g.name);
          const missingNames = bookData.genres.filter(
            (name) => !foundNames.includes(name)
          );
          throw new Error(`Genres not found: ${missingNames.join(", ")}`);
        }

        const shelfLabelCounts = bookData.shelfLabels.reduce((acc, label) => {
          const trimmed = label.trim();
          acc[trimmed] = (acc[trimmed] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);

        const uniqueLabels = Object.keys(shelfLabelCounts);
        const shelves = await this.shelfRepository.findManyByLabel(uniqueLabels);

        if (shelves.length !== uniqueLabels.length) {
          const foundLabels = shelves.map((s) => s.label);
          const missingLabels = uniqueLabels.filter((label) => !foundLabels.includes(label));
          throw new Error(`Shelves not found: ${missingLabels.join(", ")}`);
        }
        await this.entityManager.transaction(async (manager) => {
          const bookRepo = manager.getRepository(Book);

                    const newBook = new Book();
                    newBook.isbn = bookData.isbn;
                    newBook.title = bookData.title;
                    newBook.description = bookData.description;
                    newBook.cover_image = bookData.cover_image;
                    newBook.authors = authors;
                    newBook.genres = genres;

          const savedBook = await bookRepo.save(newBook);

          const auditLog = await auditLogService.createAuditLog(
            AuditLogType.CREATE,
            user_id,
            savedBook.id.toString(),
            EntityType.BOOK,
            manager
          );

          if (auditLog.error) {
            throw auditLog.error;
          }
        const copies: BookCopy[] = [];
        for (const shelf of shelves) {
          const count = shelfLabelCounts[shelf.label];
          for (let i = 0; i < count; i++) {
            const copy = new BookCopy();
            copy.book = savedBook;
            copy.shelf = shelf;
            copy.is_available = true;
            copies.push(copy);
          }
        }
        const bookCopyRepo = manager.getRepository(BookCopy)
        const savedCopies = await bookCopyRepo.save(copies);

        for (const copy of savedCopies) {
        const copyAudit = await auditLogService.createAuditLog(
          AuditLogType.CREATE,
          user_id,
          copy.id.toString(),
          EntityType.BOOK_COPY,
          manager
        );

        if (copyAudit.error) {
          throw copyAudit.error;
        }
      }
      });
        result.successCount++;
      } catch (error) {
        result.errors.push({
          row: bookData.rowNum,
          errors: [error.message],
        });
        result.failedCount++;
      }
    }
    return result;
  }

  async generateErrorSheet(errors: BulkUploadError[]): Promise<Buffer> {
    const workbook = new Workbook();

        const workSheet = setupWorksheet(workbook, {
            name: "Validation Errors",
            headers: ["Raw Data", "Error Message"],
            columnWidths: [50, 100],
        });

    for (const error of errors) {
      workSheet.addRow([error.row, error.errors.join(";")]);
    }

        const buffer = await workbook.xlsx.writeBuffer();
        return Buffer.from(buffer);
    }

    async getTrendingBooks() {
        return this.bookRepository.findPopular(8, true);
    }

    async getRecommendedBooks(user_id: number): Promise<Book[]> {
        const userBorrowRecords =
            await borrowRepository.findBorrowRecordsByEmployeeId(user_id);
        const recommendedGenresMap: Record<
            string,
            { genre: Genre; count: number }
        > = {};
        const bookhistory: Book[] = [];
        

        userBorrowRecords.forEach((borrowRecord) => {
            const book = borrowRecord.bookCopy.book;
            bookhistory.push(book);

            book.genres.forEach((genre) => {
                const key = genre.id.toString(); // or use genre.name as key if preferred
                if (recommendedGenresMap[key]) {
                    recommendedGenresMap[key].count += 1;
                } else {
                    recommendedGenresMap[key] = {
                        genre,
                        count: 1,
                    };
                }
            });
        });

        // Convert to array and sort by count descending
        const sortedGenres = Object.values(recommendedGenresMap).sort(
            (a, b) => b.count - a.count
        );

        // If you want just the genres, not their counts:
        const recommendedGenres: Genre[] = sortedGenres.map(
            (entry) => entry.genre
        );

        // Optional: top N genres (e.g., top 3)
        const topGenres = recommendedGenres.slice(0, 4);

        // 1. Create a Set of genre IDs for quick lookup
        const genreIds = new Set(topGenres.map((g) => g.id));

        // 2. Create a Set of previously read book IDs
        const readBookIds = new Set(bookhistory.map((b) => b.id));

        const books = await this.bookRepository.findMany();
        const scoredBooks = books
            .filter((book) => !readBookIds.has(book.id))
            .map((book) => {
                const matchingGenres = book.genres.filter((g) =>
                    genreIds.has(g.id)
                );
                return {
                    book,
                    score: matchingGenres.length,
                };
            })
            .filter((entry) => entry.score > 0)
            .sort((a, b) => b.score - a.score)
            .slice(0, 5);

		const recommendedBooks: Book[] = scoredBooks.map((entry) => entry.book);
		this.logger.info("recommended books returned")
		return recommendedBooks
    }
}

export default BookService;
