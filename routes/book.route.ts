import express from 'express'
import BookRepository from '../repositories/book.repository'
import datasource from '../db/data-source'
import { Book } from '../entities/book.entity'
import BookService from '../services/book.service'
import BookController from '../controllers/book.controller'
import { authorRepository } from './author.route'
import { genreRepository } from './genre.route'
import { shelfRepository } from './shelf.route'
import { bookCopyRepository } from './book-copy.route'

const bookRouter = express.Router()

const bookRepository = new BookRepository(datasource.getRepository(Book))
const bookService = new BookService(bookRepository, authorRepository, genreRepository, shelfRepository, bookCopyRepository)
const bookController = new BookController(bookService,bookRouter)

export {bookService, bookRepository}
export default bookRouter