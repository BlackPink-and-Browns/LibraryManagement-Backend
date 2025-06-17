import express from 'express'
import datasource from '../db/data-source'
import BookCopyRepository from '../repositories/book-copies.repository'
import { BookCopy } from '../entities/bookcopy.entity'
import BookCopyService from '../services/book-copy.service'
import BookCopyController from '../controllers/book-copy.controller'

const bookCopyRouter = express.Router()

const bookCopyRepository = new BookCopyRepository(datasource.getRepository(BookCopy))
const bookCopyService = new BookCopyService(bookCopyRepository)
const bookCopyController = new BookCopyController(bookCopyService,bookCopyRouter)

export {bookCopyService}
export default bookCopyRouter