import express from 'express'
import BorrowRecordRepository from '../repositories/borrow.repository'
import { BorrowRecord } from '../entities/borrowrecord.entity'
import datasource from '../db/data-source'
import BorrowService from '../services/borrow.service'
import BookCopyRepository from '../repositories/book-copies.repository'
import { BookCopy } from '../entities/bookcopy.entity'
import EmployeeRepository from '../repositories/employee.repository'
import Employee from '../entities/employee.entity'
import ShelfRepository from '../repositories/shelf.repository'
import { Shelf } from '../entities/shelf.entity'
import BorrowController from '../controllers/borrow.controller'
import NotificationRepository from '../repositories/notification.repository'
import { Notification } from '../entities/notification.entity'

const borrowRouter = express.Router()

const borrowRepository = new BorrowRecordRepository(datasource.getRepository(BorrowRecord));
const bookCopyRepository=new BookCopyRepository(datasource.getRepository(BookCopy));
const employeeRepository=new EmployeeRepository(datasource.getRepository(Employee));
const shelfRepository=new ShelfRepository(datasource.getRepository(Shelf));
const notificationRepository=new NotificationRepository(datasource.getRepository(Notification));
const borrowService = new BorrowService(borrowRepository,bookCopyRepository,employeeRepository,shelfRepository,notificationRepository);
const borrowController = new BorrowController(borrowService,borrowRouter)

export {borrowService};
export default borrowRouter;


