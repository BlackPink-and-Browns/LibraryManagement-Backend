import express from 'express';
import GenreRepository from '../repositories/genre.repository';
import BookRepository from '../repositories/book.repository';
import datasource from '../db/data-source';
import { Genre } from '../entities/genre.entity';
import { Book } from '../entities/book.entity';
import GenreService from '../services/genre.service';
import GenreController from '../controllers/genre.controller';

const genreRouter = express.Router();

const genreRepository = new GenreRepository(datasource.getRepository(Genre));
const bookRepository = new BookRepository(datasource.getRepository(Book));
const genreService = new GenreService(genreRepository);
const genreController = new GenreController(genreService, genreRouter);

export { genreService, genreRepository };
export default genreRouter;
