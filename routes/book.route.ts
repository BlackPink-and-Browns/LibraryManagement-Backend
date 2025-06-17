import express from 'express'
import BookRepository from '../repositories/book.repository'
import datasource from '../db/data-source'
import { Book } from '../entities/book.entity'
import BookService from '../services/book.service'
import BookController from '../controllers/book.controller'

const bookRouter = express.Router()

const bookRepository = new BookRepository(datasource.getRepository(Book))
const bookService = new BookService(bookRepository)
const bookController = new BookController(bookService,bookRouter)

export {bookService}
export default bookRouter