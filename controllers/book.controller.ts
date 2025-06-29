import { plainToInstance } from "class-transformer";
import httpException from "../exceptions/http.exception";
import BookService from "../services/book.service";
import { Request, Response, Router, NextFunction } from "express";
import { CreateBookDTO } from "../dto/books/create-book.dto";
import { validate } from "class-validator";
import { UpdateBookDTO } from "../dto/books/update-book.dto";
import { Book } from "../entities/book.entity";

import multer from "multer";
import { EmployeeRole } from "../entities/enums";
import { checkRole } from "../middlewares/authorization.middleware";
import { BulkUploadErrorDto } from "../dto/bulkupload/create-bulkupload.dto";

const upload = multer({ storage: multer.memoryStorage() });

class BookController {
    constructor(private bookService: BookService, router: Router) {
        router.get("/", this.getAllBooks.bind(this));
        router.get("/popular", this.getTrendingBooks.bind(this));
        router.get("/recommended", this.getRecommendedBooks.bind(this));
        router.get(
            "/bulk",
            checkRole([EmployeeRole.ADMIN]),
            this.createBookBulkTemplate.bind(this)
        );
        router.post(
            "/bulk",
            checkRole([EmployeeRole.ADMIN]),
            upload.single("bulk_upload"),
            this.createBookInBulk.bind(this)
        );
        router.post(
            "/bulk/errors",
            checkRole([EmployeeRole.ADMIN]),
            this.createBookBulkErrorSheet.bind(this)
        );

        router.get("/isbn/:isbn", this.getBookByISBN.bind(this));
        router.get(
            "/:id",
            this.getBookByID.bind(this)
        );
        router.post(
            "/",
            checkRole([EmployeeRole.ADMIN]),
            this.createBook.bind(this)
        );
        // router.post("/:isbn", checkRole([EmployeeRole.ADMIN]));
        router.patch(
            "/:id",
            checkRole([EmployeeRole.ADMIN]),
            this.updateBook.bind(this)
        );
        router.delete(
            "/:id",
            checkRole([EmployeeRole.ADMIN]),
            this.deleteBook.bind(this)
        );
    }

    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            const createBookDto = plainToInstance(CreateBookDTO, req.body);
            const errors = await validate(createBookDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(400, JSON.stringify(errors));
            }
            const book: Book = await this.bookService.createBook(
                createBookDto.title,
                createBookDto.isbn,
                createBookDto.description,
                createBookDto.cover_image,
                createBookDto.authors,
                createBookDto.genres,
                req.user?.id
            );
            res.status(201).send(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async createBookBulkTemplate(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const fileBuffer = await this.bookService.createBookBulkTemplate();
            res.setHeader(
                "Content-Disposition",
                "attachment; filename=book_bulk_upload_template.xlsx"
            );
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.send(fileBuffer);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async createBookInBulk(req: Request, res: Response, next: NextFunction) {
        try {
            const file = await req.file;
            if (!file) {
                throw new httpException(400, "CSV file is required");
            }

            const allowedMimeTypes = [
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                "application/vnd.ms-excel",
            ];
            if (!allowedMimeTypes.includes(req.file.mimetype)) {
                throw new httpException(
                    400,
                    "Invalid file type. Please upload an Excel file (.xlsx or .xls)"
                );
            }

            const result = await this.bookService.bulkUploadBooks(
                req.file.buffer,
                req.user?.id
            );
            return res.status(200).send(result);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async createBookBulkErrorSheet(
        req: Request,
        res: Response,
        next: NextFunction
    ) {
        try {
            const { errors } = req.body;

            const errorRequestDto = plainToInstance(
                BulkUploadErrorDto,
                req.body
            );
            const requestErrors = await validate(errorRequestDto);
            if (requestErrors.length > 0) {
                throw new httpException(400, JSON.stringify(requestErrors));
            }

            const fileBuffer = await this.bookService.generateErrorSheet(
                errorRequestDto.errors
            );

            res.setHeader(
                "Content-Disposition",
                "attachment; filename=book_bulk_upload_errors.xlsx"
            );
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.send(fileBuffer);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
    async updateBook(req: Request, res: Response, next: NextFunction) {
        try {
            const updateBookDto = plainToInstance(UpdateBookDTO, req.body);
            const errors = await validate(updateBookDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(404, JSON.stringify(errors));
            }

            await this.bookService.updateBook(
                Number(req.params.id),
                req.body,
                req.user?.id
            );
            res.status(202).send();
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteBook(req: Request, res: Response, next: NextFunction) {
        try {
            await this.bookService.deleteBookById(
                Number(req.params.id),
                req.user?.id
            );
            res.status(204).send();
        } catch (error) {
            next(error); // Pass error to the global error handler
        }
    }

    async getAllBooks(req: Request, res: Response, next: NextFunction) {
        try {
            let books: Book[] = undefined;
            if (req.user?.role === EmployeeRole.ADMIN) {
                books = await this.bookService.getAllBooks();
            } else {
                books = await this.bookService.getAllBooks(false);
            }
            res.status(200).json(books);
        } catch (error) {
            next(error); // Pass error to the global error handler
        }
    }

    async getBookByID(req: Request, res: Response, next: NextFunction) {
        try {
            let book: Book = undefined;
            if (req.user?.role == EmployeeRole.ADMIN) {
                book = await this.bookService.getBookById(
                    Number(req.params.id),
                );
            } else {
                book = await this.bookService.getBookById(
                    Number(req.params.id),
                    false
                );
            }

            if (!book) {
                throw new httpException(404, "book not found");
            }
            res.status(200).json(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getBookByISBN(req: Request, res: Response, next: NextFunction) {
        try {
            let book: Book = undefined;
            if (req.user?.role == EmployeeRole.ADMIN) {
                book = await this.bookService.getBookByISBN(
                    req.params.isbn,
                );
            } else {
                book = await this.bookService.getBookByISBN(req.params.isbn, false);
            }
            if (!book) {
                throw new httpException(404, "book not found");
            }
            res.status(200).json(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getTrendingBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await this.bookService.getTrendingBooks();
            res.status(200).json(books);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async getRecommendedBooks(req: Request, res: Response, next: NextFunction) {
        try {
            const books = await this.bookService.getRecommendedBooks(
                Number(req.user?.id)
            );
            res.status(200).json(books);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default BookController;
