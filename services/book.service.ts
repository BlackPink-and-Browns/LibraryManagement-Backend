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

class BookService {
    private entityManager = datasource.manager
    private logger = LoggerService.getInstance(BookService.name);
    constructor(private bookRepository: BookRepository) {}

    async createBook(
        title: string,
        isbn: string,
        description: string,
        cover_image: string,
        authors: Author[],
        genres: Genre[],
        user_id?: number
    ): Promise<Book> {
        
        const book = new Book();
        book.authors = authors;
        book.title = title;
        book.cover_image = cover_image;
        book.description = description;
        book.isbn = isbn;
        book.genres = genres;
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Book)
            const createdBook = await m.save(book);
            this.logger.info("Book Created");
            // throw new httpException(400, "qwerty");
            await auditLogService.createAuditLog(
                "CREATE",
                user_id,
                createdBook.id.toString(),
                "BOOK",
                manager
            );
            return createdBook;
        });
    }

    // async createBookUsingISBN(bookData:OpenLibraryBook): Promise<Book> {
    //     const book = new Book()
    //     book.title = bookData.title

    //     return this.bookRepository.create(book)
    // }

    // async createBookInBulk(books: Book[],user_id:number): Promise<void> {
    //     books.forEach((book) => {
    //         this.createBook(
    //             book.title,
    //             book.isbn,
    //             book.description,
    //             book.cover_image,
    //             book.authors,
    //             book.genres,
    //             user_id
    //         );
    //     });
    // }

    async updateBook(
        id: number,
        updateData: Partial<Book>,
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
            book.authors = updateData.authors;
        }
        if (updateData.genres !== undefined) {
            book.genres = updateData.genres;
        }
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Book)
            await m.save({id, ...book});
            this.logger.info("Book Updated");
            auditLogService.createAuditLog(
                "UPDATE",
                user_id,
                id.toString(),
                "BOOK",
                manager
            );
        });
    }

    async deleteBookById(id: number, user_id: number): Promise<void> {
        
        const book = await this.bookRepository.findOneByID(id);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Book)
            await m.delete({id});
            this.logger.info("Book Deleted");
            auditLogService.createAuditLog(
                "DELETE",
                user_id,
                id.toString(),
                "BOOK"
            );
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
        const is_available = book.copies.some((copy) => copy.is_available);
        book.is_available = is_available;
        await this.bookRepository.update(id, book);

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
}

export default BookService;
