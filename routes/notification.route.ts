import express from 'express'
import datasource from '../db/data-source'
import { Waitlist } from '../entities/waitlist.entity'
import WaitlistRepository from '../repositories/waitlist.repository'
import WaitlistService from '../services/waitlist.service'
import WaitlistController from '../controllers/waitlist.controller'
import BookRepository from '../repositories/book.repository'
import { Book } from '../entities/book.entity'
import NotificationRepository from '../repositories/notification.repository'
import { Notification } from '../entities/notification.entity'
import NotificationService from '../services/notification.service'
import NotificationController from '../controllers/notification.controller'

const notificationRouter = express.Router()

const notificationRepository = new NotificationRepository(datasource.getRepository(Notification))
const notificationService = new NotificationService(notificationRepository)
const notificationController = new NotificationController(notificationService,notificationRouter)

export {notificationService}
export default notificationRouter


