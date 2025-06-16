import express from 'express'
import datasource from '../db/data-source'
import { Waitlist } from '../entities/waitlist.entity'
import WaitlistRepository from '../repositories/waitlist.repository'
import WaitlistService from '../services/waitlist.service'
import WaitlistController from '../controllers/waitlist.controller'
import BookRepository from '../repositories/book.repository'
import { Book } from '../entities/book.entity'

const waitlistRouter = express.Router()

const waitlistRepository = new WaitlistRepository(datasource.getRepository(Waitlist))
const bookRepository = new BookRepository(datasource.getRepository(Book))
const waitlistService = new WaitlistService(waitlistRepository, bookRepository)
const waitlistController = new WaitlistController(waitlistService,waitlistRouter)

export {waitlistService}
export default waitlistRouter


