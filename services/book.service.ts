import { Repository } from "typeorm";
import BookRepository from "../repositories/book.repository";
import { Book } from "../entities/book.entity";
import httpException from "../exceptions/http.exception";
import { LoggerService } from "./logger.service";
import { Author } from "../entities/author.entity";
import { Genre } from "../entities/genre.entity";
import { auditLogService } from "../routes/audit.route";
import { Review } from "../entities/review.entity";

class BookService {
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

        this.logger.info("Book Created")
        const createdBook = await this.bookRepository.create(book);
        auditLogService.createAuditLog(
            "CREATE",
            user_id,
            createdBook.id.toString(),
            "BOOK"
        );
        return createdBook;
    }

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

        if (updateData.authors) {
            book.authors = updateData.authors;
        }
        if (updateData.genres) {
            book.genres = updateData.genres;
        }
        this.logger.info("Book Updated")
        await this.bookRepository.update(id, book);
        auditLogService.createAuditLog(
            "UPDATE",
            user_id,
            id.toString(),
            "BOOK"
        );
    }

    async deleteBookById(id: number, user_id: number): Promise<void> {
        const book = await this.bookRepository.findOneByID(id);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }
        auditLogService.createAuditLog(
            "DELETE",
            user_id,
            id.toString(),
            "BOOK"
        );
        this.logger.info("Book Deleted")
        await this.bookRepository.delete(id);
    }

    async getAllBooks(): Promise<Book[]> {
        this.logger.info("Book Array Returned")
        return this.bookRepository.findMany();
    }

    async getBookById(id: number): Promise<Book> {
        const book = await this.bookRepository.findOneByID(id);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }
        this.logger.info("Book returned")
        return this.bookRepository.findOneByID(id);
    }
}

export default BookService;
