import { plainToInstance } from "class-transformer";
import BookCopyService from "../services/book-copy.service";
import { Request, Response, Router, NextFunction } from "express";
import { CreateBookCopyDTO } from "../dto/book-copies/create-book-copies.dto";
import { validate } from "class-validator";
import httpException from "../exceptions/http.exception";
import { UpdateBookCopyDTO} from "../dto/book-copies/update-book-copies.dto";
import { checkRole } from "../middlewares/authorization.middleware";
import { EmployeeRole } from "../entities/enums";

class BookCopyController {
    constructor(private bookCopyService: BookCopyService, router: Router) {
        router.get("/copies/:id",this.getBookCopyByCopyId.bind(this));
        router.post("/copies",checkRole([EmployeeRole.ADMIN]),this.CreateBookCopy.bind(this));
        router.patch("/copies/:id",this.updateBookCopy.bind(this));
        router.delete("/copies/:id",checkRole([EmployeeRole.ADMIN]),this.deleteBookCopy.bind(this));
    }

    async CreateBookCopy(req: Request, res: Response, next: NextFunction) {
        try {
            const createBookCopyDto = plainToInstance(
                CreateBookCopyDTO,
                req.body
            );
            const errors = await validate(createBookCopyDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(400, JSON.stringify(errors));
            }
            const bookCopy = await this.bookCopyService.createBookCopy(
                createBookCopyDto.book_id,
                createBookCopyDto.count,
                req.user?.id,
                createBookCopyDto.shelf_id
            );
            res.status(201).send(bookCopy);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }

    async updateBookCopy(req: Request, res: Response, next: NextFunction) {
        try {
            const updateBookCopyDto = plainToInstance(
                UpdateBookCopyDTO,
                req.body
            );
            const errors = await validate(updateBookCopyDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(404, JSON.stringify(errors));
            }
            await this.bookCopyService.updateBookCopy(
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

    async deleteBookCopy(req: Request, res: Response) {
        await this.bookCopyService.deleteBookCopy(
            Number(req.params.id),
            req.user?.id
        );
        res.status(204).send();
    }

    async getBookCopyByCopyId(req: Request, res: Response, next: NextFunction) {
        try {
            const bookCopy = await this.bookCopyService.getBookCopyByCopyId(
                Number(req.params.id)
            );
            if (!bookCopy) {
                throw new httpException(404, "book copy not found");
            }
            res.status(200).send(bookCopy);
        } catch (error) {
            console.log(error);
            next(error);
        }
    }
}

export default BookCopyController
