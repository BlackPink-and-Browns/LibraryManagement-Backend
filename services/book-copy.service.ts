import datasource from "../db/data-source";
import { updateBookCopyDTO } from "../dto/book-copies/update-book-copies.dto";
import { BookCopy } from "../entities/bookcopy.entity";
import httpException from "../exceptions/http.exception";
import BookCopyRepository from "../repositories/book-copies.repository";
import { auditLogService } from "../routes/audit.route";
import { bookService } from "../routes/book.route";
import { shelfService } from "../routes/shelf.route";
import { LoggerService } from "./logger.service";

class BookCopyService {
    private entityManager = datasource.manager
    private logger = LoggerService.getInstance(BookCopyService.name);
    constructor(private bookCopyRepository: BookCopyRepository) {}

    async createBookCopy(
        book_id: number,
        count: number,
        user_id: number
    ): Promise<BookCopy> {
        for (let i = 0; i < count; i++) {
            const bookCopy = new BookCopy();
            const book = await bookService.getBookById(book_id);
            if (!book) {
                this.logger.error("Book does not exist");
                throw new httpException(400, "Book Not Found");
            }
            bookCopy.book = book;
            bookCopy.is_available = true;
            return await this.entityManager.transaction(async manager => {
                const m = manager.getRepository(BookCopy)
                const createdBookCopy = await m.save(
                    bookCopy
                );
                auditLogService.createAuditLog(
                    "CREATE",
                    user_id,
                    createdBookCopy.id.toString(),
                    "BOOK",
                    manager
                );
                this.logger.info("Book Copy Created");
                return createdBookCopy;
            });
        }
    }

    async updateBookCopy(
        copy_id: number,
        updateCopy: updateBookCopyDTO,
        user_id: number
    ): Promise<void> {
        const bookCopy = await this.bookCopyRepository.findOneByID(copy_id);
        if (!bookCopy) {
            this.logger.error("Book Copy does not exist");
            throw new httpException(400, "Book Copy Not Found");
        }
        if (updateCopy.is_available !== undefined)
            bookCopy.is_available = updateCopy.is_available;
        if (updateCopy.shelf_id !== undefined) {
            const shelf = await shelfService.getOneByID(updateCopy.shelf_id);
            bookCopy.shelf = shelf;
        }
        return await this.entityManager.transaction(async manager => {
            const m = manager.getRepository(BookCopy)
            await m.save({ copy_id, ...bookCopy });
            this.logger.info("Book copy Updated");
            auditLogService.createAuditLog(
                "UPDATE",
                user_id,
                copy_id.toString(),
                "BOOK",
                manager
            );
        });
    }

    async deleteBookCopy(copy_id: number,user_id:number): Promise<void> {
        const bookCopy = await this.bookCopyRepository.findOneByID(copy_id);
        if (!bookCopy) {
            this.logger.error("Book Copy does not exist");
            throw new httpException(400, "Book Copy Not Found");
        }
        return await this.entityManager.transaction(async manager => {
            const m = manager.getRepository(BookCopy)
            await m.delete({id:copy_id });
            this.logger.info("Book Copy Deleted");
            auditLogService.createAuditLog(
                "DELETE",
                user_id,
                copy_id.toString(),
                "BOOK",
                manager
            );
        });
        

    }

    async getAllBookCopiesByBookId(book_id: number): Promise<BookCopy[]> {
        const book = await bookService.getBookById(book_id);
        if (!book) {
            this.logger.error("Book does not exist");
            throw new httpException(400, "Book Not Found");
        }
        this.logger.info("Book Copies Returned");
        return this.bookCopyRepository.findCopiesByBookID(book_id);
    }

    async getBookCopyByCopyId(copy_id: number): Promise<BookCopy> {
        const bookCopy = await this.bookCopyRepository.findOneByID(copy_id);
        if (!bookCopy) {
            this.logger.error("Book Copy does not exist");
            throw new httpException(400, "Book Copy Not Found");
        }
        this.logger.info("Book Copy Returned");
        return bookCopy;
    }

    async getAllbookCopies(): Promise<BookCopy[]> {
        this.logger.info("All copies Returned");
        return this.bookCopyRepository.findAll();
    }
}

export default BookCopyService;
