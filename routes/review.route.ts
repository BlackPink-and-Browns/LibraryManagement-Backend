import express from 'express';
import datasource from '../db/data-source';

import ReviewRepository from '../repositories/review.repository';
import BookRepository from '../repositories/book.repository';
import EmployeeRepository from '../repositories/employee.repository';

import { Review } from '../entities/review.entity';
import { Book } from '../entities/book.entity';
import Employee from '../entities/employee.entity';

import ReviewService from '../services/review.service';
import ReviewController from '../controllers/review.controller';

const reviewRouter = express.Router();

const reviewRepository = new ReviewRepository(datasource.getRepository(Review));
const bookRepository = new BookRepository(datasource.getRepository(Book));
const employeeRepository = new EmployeeRepository(datasource.getRepository(Employee));

const reviewService = new ReviewService(reviewRepository, bookRepository, employeeRepository);
const reviewController = new ReviewController(reviewService, reviewRouter);

export { reviewService };
export default reviewRouter;
