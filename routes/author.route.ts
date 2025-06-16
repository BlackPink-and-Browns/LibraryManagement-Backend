import express from 'express'
import datasource from '../db/data-source'
import AuthorRepository from '../repositories/author.repository'
import { Author } from '../entities/author.entity'
import AuthorService from '../services/author.service'
import AuthorController from '../controllers/author.controller'

const authorRouter = express.Router()

const authorRepository = new AuthorRepository(datasource.getRepository(Author))
const authorService = new AuthorService(authorRepository)
const authorController = new AuthorController(authorService,authorRouter)

export {authorService}
export default authorRouter


