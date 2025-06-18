import express from 'express'
import datasource from '../db/data-source'
import AuthorRepository from '../repositories/author.repository'
import { Author } from '../entities/author.entity'
import AuthorService from '../services/author.service'
import AuthorController from '../controllers/author.controller'
import AnalyticsService from '../services/analytics.service'
import AnalyticsController from '../controllers/analytics.controller'
import { bookRepository } from './book.route'
import { employeeRepository } from './employee.route'
import { shelfRepository } from './shelf.route'
import { bookCopyRepository } from './book-copy.route'
import { auditLogRepository } from './audit.route'

const analyticsRouter = express.Router()

const analyticsService = new AnalyticsService(bookRepository, employeeRepository, shelfRepository, bookCopyRepository, auditLogRepository)
const analyticsController = new AnalyticsController(analyticsService, analyticsRouter)

export {analyticsService}
export default analyticsRouter


