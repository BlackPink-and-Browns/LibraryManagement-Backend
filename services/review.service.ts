import { InsertResult } from "typeorm";
import { LoggerService } from "./logger.service";
import httpException from "../exceptions/http.exception";
import { CreateReviewDto } from "../dto/review/create-review.dto";
import { UpdateReviewDto } from "../dto/review/update-review.dto";
import { Review } from "../entities/review.entity";
import ReviewRepository from "../repositories/review.repository";
import { Book } from "../entities/book.entity";
import Employee from "../entities/employee.entity";
import BookRepository from "../repositories/book.repository";
import EmployeeRepository from "../repositories/employee.repository";

class ReviewService {
  private logger = LoggerService.getInstance(ReviewService.name);

  constructor(
    private reviewRepository: ReviewRepository,
    private bookRepository: BookRepository,
    private employeeRespository: EmployeeRepository
  ) {}

  async getReviewsByBookId(bookId: number): Promise<Review[]> {
    const reviews = await this.reviewRepository.findByBookId(bookId);
    this.logger.info(`Fetched ${reviews.length} reviews for book ID ${bookId}`);
    return reviews;
  }

  async getReviewsByUserId(userId: number): Promise<Review[]> {
    const reviews = await this.reviewRepository.findByUserId(userId);
    this.logger.info(`Fetched ${reviews.length} reviews for user ID ${userId}`);
    return reviews;
  }

  async createReview(
    createDto: CreateReviewDto,
    userId: number
  ): Promise<Review> {
    const book = await this.bookRepository.findOneByID(createDto.bookId);
    if (!book) {
      this.logger.error("Book not found");
      throw new httpException(404, "Book not found");
    }

    const employee = await this.employeeRespository.findOneByID(userId);
    if (!employee) {
      this.logger.error("User not found");
      throw new httpException(404, "User not found");
    }

    const existingReview = await this.reviewRepository.findByBookIdAndUserId(
      createDto.bookId,
      userId
    );
    if (existingReview) {
      this.logger.warn("Duplicate review attempted");
      throw new httpException(409, "You have already reviewed this book");
    }

    
    const review = new Review();
    review.rating = createDto.rating;
    review.content = createDto.content;
    review.book = book;
    review.employee = employee;

    this.logger.info("Review created");
    return await this.reviewRepository.create(review);
  }

  async updateReview(id: number, updateDto: UpdateReviewDto): Promise<Review> {
    const review = await this.reviewRepository.findOneByID(id);
    if (!review) {
      this.logger.error("Review not found");
      throw new httpException(404, "Review not found");
    }

    if (updateDto.rating !== undefined) {
      review.rating = updateDto.rating;
    }

    if (updateDto.content !== undefined) {
      review.content = updateDto.content;
    }

    await this.reviewRepository.update(id, review);
    this.logger.info(`Review ${id} updated`);
    return review;
  }

  async deleteReview(id: number): Promise<void> {
    const review = await this.reviewRepository.findOneByID(id);
    if (!review) {
      this.logger.error("Review not found");
      throw new httpException(404, "Review not found");
    }

    await this.reviewRepository.remove(review);
    this.logger.info(`Review ${id} deleted`);
  }
}

export default ReviewService;
