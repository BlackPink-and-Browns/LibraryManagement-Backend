import { Request, Response, Router, NextFunction } from "express";
import { EmployeeRole } from "../entities/enums";
import httpException from "../exceptions/http.exception";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {checkRole } from "../middlewares/authorization.middleware";
import AuthorService from "../services/author.service";
import { CreateAuthorDTO } from "../dto/authors/create-author.dto";
import { Author } from "../entities/author.entity";
import { UpdateAuthorDTO } from "../dto/authors/update-author.dto";

class AuthorController {
    constructor(private authorService: AuthorService, router: Router) {
        router.post("/", checkRole([EmployeeRole.ADMIN]), this.createAuthor.bind(this));
        router.get("/", this.getAllAuthors.bind(this));
        router.get("/:id", this.getAuthorByID.bind(this));
        router.put("/:id", checkRole([EmployeeRole.ADMIN]), this.updateAuthor.bind(this));
    }

    async createAuthor(req: Request, res: Response, next: NextFunction) {
        try {
            const createAuthorDTO = plainToInstance(
                CreateAuthorDTO,
                req.body
            );
            const errors = await validate(createAuthorDTO);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(400, JSON.stringify(errors));
            }

            const author = await this.authorService.createAuthor(
                createAuthorDTO,
            );

            res.status(201).send();
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async getAllAuthors(req: Request, res: Response) {
        const authors: Author[] = await this.authorService.getAllAuthors();
        res.status(200).send(authors);
    }

    async getAuthorByID(req: Request, res: Response, next: NextFunction) {
        try {
            const e = await this.authorService.getAuthorByID(
                Number(req.params.id)
            );
            if (!e) {
                throw new httpException(404, "author not found");
            }
            res.status(200).send(e);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    updateAuthor = async (req: Request,res: Response,next: NextFunction) => {
        try {
            const updateAuthorDTO = plainToInstance(
                UpdateAuthorDTO,
                req.body
            );
            const errors = await validate(updateAuthorDTO);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(404, JSON.stringify(errors));
            }
            const id = Number(req.params.id);
            await this.authorService.updateAuthor(
                id,
                updateAuthorDTO
            );

            res.status(200).send();
        } catch (err) {
            console.log(err);
            next(err);
        }
    }
}

export default AuthorController;
