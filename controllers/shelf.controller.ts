import { Request, Response, Router, NextFunction } from "express";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import ShelfService from "../services/shelf.service";
import httpException from "../exceptions/http.exception";
import { CreateShelfDto } from "../dto/shelf/create-shelf.dto";
import { UpdateShelfDto } from "../dto/shelf/update-shelf.dto";

class ShelfController {
  constructor(private shelfService: ShelfService, router: Router) {
    router.get("/", this.getAllShelves.bind(this));
    router.get("/count", this.getShelfCount.bind(this));
    router.get("/:id", this.getShelfById.bind(this));
    router.post("/", this.createShelf.bind(this));
    router.patch("/:id", this.updateShelf.bind(this));
    router.delete("/:id", this.deleteShelf.bind(this));
  }

  async getAllShelves(req: Request, res: Response, next: NextFunction) {
    try {
      const shelves = await this.shelfService.getAll();
      res.status(200).send(shelves);
    } catch (err) {
      next(err);
    }
  }

  async getShelfById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const shelf = await this.shelfService.getOneByID(id);
      if (!shelf) throw new httpException(404, "Shelf not found");
      res.status(200).send(shelf);
    } catch (err) {
      next(err);
    }
  }

  async createShelf(req: Request, res: Response, next: NextFunction) {
    try {
      const createDto = plainToInstance(CreateShelfDto, req.body);
      const errors = await validate(createDto);
      if (errors.length > 0) {
        throw new httpException(400, JSON.stringify(errors));
      }
      const shelf = await this.shelfService.create(createDto, req.user?.id);
      res.status(201).send(shelf);
    } catch (err) {
      next(err);
    }
  }

  async updateShelf(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      const updateDto = plainToInstance(UpdateShelfDto, req.body);
      const errors = await validate(updateDto);
      if (errors.length > 0) {
        throw new httpException(400, JSON.stringify(errors));
      }

      const updated = await this.shelfService.update(
        id,
        updateDto,
        req.user?.id
      );
      res.status(200).send(updated);
    } catch (err) {
      next(err);
    }
  }

  async deleteShelf(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      await this.shelfService.delete(id, req.user?.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  async getShelfCount(req: Request, res: Response, next: NextFunction) {
    try {
      const count = await this.shelfService.getShelfCount();
      res.status(200).send({ count });
    } catch (err) {
      next(err);
    }
  }
}

export default ShelfController;
