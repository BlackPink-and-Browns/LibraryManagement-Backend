import { Request, Response, Router, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import GenreService from "../services/genre.service";
import { CreateGenreDTO } from "../dto/genres/create-genre.dto";
import httpException from "../exceptions/http.exception";

class GenreController {
  constructor(private genreService: GenreService, router: Router) {
    router.get("/", this.getAllGenres.bind(this));
    router.get("/:id", this.getGenreById.bind(this));
    router.post("/", this.createGenre.bind(this));
    router.delete("/:id", this.deleteGenre.bind(this));
  }

  async getAllGenres(req: Request, res: Response, next: NextFunction) {
    try {
      const genres = await this.genreService.getAllGenres();
      res.status(200).send(genres);
    } catch (err) {
      next(err);
    }
  }

  async getGenreById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const genre = await this.genreService.getGenreById(id);
      if (!genre) throw new httpException(404, "Genre not found");
      res.status(200).send(genre);
    } catch (err) {
      next(err);
    }
  }

  async createGenre(req: Request, res: Response, next: NextFunction) {
    try {
      const createDto = plainToInstance(CreateGenreDTO, req.body);
      const errors = await validate(createDto);
      if (errors.length > 0) {
        throw new httpException(400, JSON.stringify(errors));
      }

      const genre = await this.genreService.createGenre(createDto, req.user?.id);
      res.status(201).send(genre);
    } catch (err) {
      next(err);
    }
  }

  async deleteGenre(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await this.genreService.deleteGenre(id, req.user?.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default GenreController;
