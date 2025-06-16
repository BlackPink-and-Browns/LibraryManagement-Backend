import { plainToInstance } from "class-transformer";
import httpException from "../exceptions/http.exception";
import BookService from "../services/book.service";
import { Request, Response, Router, NextFunction } from "express";
import { CreateBookDTO } from "../dto/books/create-book.dto";
import { validate } from "class-validator";
import { authorService } from "../routes/author.route";
import { Author } from "../entities/author.entity";
import { Genre } from "../entities/genre.entity";
import { Review } from "../entities/review.entity";
import { reviewService } from "../routes/review.route";
import { UpdateBookDTO } from "../dto/books/update-book.dto";
import { Book } from "../entities/book.entity";

import multer from "multer";
import * as fs from "fs/promises";
import * as Papa from "papaparse";

const upload = multer({ dest: "uploads/" }); // saves file to `uploads/` folder

class BookController {
    constructor(private bookService: BookService, router: Router) {
        router.get("/", this.getAllBooks.bind(this));
        router.get("/:id", this.getBookByID.bind(this));
        router.post("/", this.createBook.bind(this));
        router.post(
            "/bulk",
            upload.single("file"),
            this.createBookInBulk.bind(this)
        );
        router.patch("/:id",this.updateBook.bind(this))
        router.delete("/:id",this.deleteBook.bind(this))
    }

    async createBook(req: Request, res: Response, next: NextFunction) {
        try {
            const createBookDto = plainToInstance(CreateBookDTO, req.body);
            const errors = await validate(createBookDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(400, JSON.stringify(errors));
            }

            const genres: Genre[] = await Promise.all(
                createBookDto.genres.map((genre_id) =>
                    authorService.getGenreByID(genre_id)
                )
            );
            const authors: Author[] = await Promise.all(
                createBookDto.authors.map((author_id) =>
                    authorService.getAuthorByID(author_id)
                )
            );
            const book: Book = await this.bookService.createBook(
                createBookDto.title,
                createBookDto.isbn,
                createBookDto.description,
                createBookDto.cover_image,
                authors,
                genres,
                req.user?.id
            );
            res.status(201).send(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async createBookInBulk(req: Request, res: Response, next: NextFunction) {
        try {
            // Get file details from req.file
            const file = req.file;

            if (!file) {
                throw new httpException(400, "CSV file is required");
            }

            // Access file path, name, etc.
            const filePath = file.path;
            const originalName = file.originalname;

            // Read and parse the file (e.g., using fs or papaparse)
            const fs = await import("fs/promises");
            const csvContent = await fs.readFile(filePath, "utf-8");

            const parsed = Papa.parse(csvContent, {
                header: true,
                skipEmptyLines: true,
            });
            const records = parsed.data as any[];
            if (!records.length) {
                throw new httpException(40, "CSV is empty or invalid");
            }

            records.forEach(async (book) => {
                const createBookDto = plainToInstance(CreateBookDTO, book);
                const errors = await validate(createBookDto);
                if (errors.length > 0) {
                    console.log(JSON.stringify(errors));
                    throw new httpException(400, JSON.stringify(errors));
                }

                const genres: Genre[] = await Promise.all(
                    createBookDto.genres.map((genre_id) =>
                        authorService.getGenreByID(genre_id)
                    )
                );
                const authors: Author[] = await Promise.all(
                    createBookDto.authors.map((author_id) =>
                        authorService.getAuthorByID(author_id)
                    )
                );
                const b: Book = await this.bookService.createBook(
                    createBookDto.title,
                    createBookDto.isbn,
                    createBookDto.description,
                    createBookDto.cover_image,
                    authors,
                    genres,
                    req.user?.id
                );
            });

            return res.status(200).send();
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
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
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async deleteBook(req: Request, res: Response) {
        await this.bookService.deleteBookById(
            Number(req.params.id),
            req.user?.id
        );
        res.status(204).send();
    }

    async getAllBooks(req: Request, res: Response) {
        const books = this.bookService.getAllBooks();
        res.status(200).json(books);
    }

    async getBookByID(req: Request, res: Response, next: NextFunction) {
        try {
            const book = this.bookService.getBookById(Number(req.params.id));
            if (!book) {
                throw new httpException(404, "employee not found");
            }
            res.status(200).json(book);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default BookController;
