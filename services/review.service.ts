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
import { auditLogService } from "../routes/audit.route";
import datasource from "../db/data-source";
import { AuditLogType } from "../entities/enums";

class ReviewService {
    private entityManager = datasource.manager;
    private logger = LoggerService.getInstance(ReviewService.name);

    constructor(
        private reviewRepository: ReviewRepository,
        private bookRepository: BookRepository,
        private employeeRespository: EmployeeRepository
    ) {}

    async getReviewsByBookId(bookId: number): Promise<Review[]> {
        const book = await this.bookRepository.findOneByID(bookId); // Check if book exists

        if (!book) {
            this.logger.error(`Book with id ${bookId} not found`);
            throw new httpException(404, "Book not found");
        }

        const reviews = await this.reviewRepository.findByBookId(bookId);
        this.logger.info(
            `Fetched ${reviews.length} reviews for book ID ${bookId}`
        );
        return reviews;
    }

    async getReviewsByUserId(userId: number): Promise<Review[]> {
        const user = await this.employeeRespository.findOneByID(userId); // Check if user exists
        if (!user) {
            this.logger.error(`User with id ${userId} not found`);
            throw new httpException(404, "User not found");
        }

        const reviews = await this.reviewRepository.findByUserId(userId);
        this.logger.info(
            `Fetched ${reviews.length} reviews for user ID ${userId}`
        );
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

        const existingReview =
            await this.reviewRepository.findByBookIdAndUserId(
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
        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Review);
            const createdReview = await m.save(review);

            const error = await auditLogService.createAuditLog(
                AuditLogType.CREATE,
                userId,
                createdReview.id.toString(),
                "REVIEW",
                manager
            );
            if (error.error) {
                throw error.error;
            }

            this.logger.info("Review created");
            return createdReview;
        });
    }

    async updateReview(
        id: number,
        updateDto: UpdateReviewDto,
        userId: number
    ): Promise<void> {
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

        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(Review);
            const reviewUpdated = await m.save({ id, ...review });

            const error = await auditLogService.createAuditLog(
                AuditLogType.UPDATE,
                userId,
                review.id.toString(),
                "REVIEW"
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info(`Review ${id} updated`);
        });
    }

    async deleteReview(id: number, userId: number): Promise<void> {
        const review = await this.reviewRepository.findOneByID(id);

        if (!review) {
            this.logger.error("Review not found");
            throw new httpException(404, "Review not found");
        }
        return await this.entityManager.transaction(async (manager) => {
          const m = manager.getRepository(Review)
            await m.remove(review);
            this.logger.info(`Review ${id} deleted`);
            const error = await auditLogService.createAuditLog(
                AuditLogType.DELETE,
                userId,
                review.id.toString(),
                "REVIEW",
                manager
            );
            if (error.error) {
                throw error.error;
            }
        });
    }

    async getReviewCountByBookId(bookId: number): Promise<number> {
        // Check if the book exists before counting reviews
        const book = await this.bookRepository.findOneByID(bookId);
        if (!book) {
            this.logger.error(`Book with id ${bookId} not found`);
            throw new httpException(404, "Book not found");
        }

        // Return the count of reviews for the book
        const count = await this.reviewRepository.countByBookId(bookId);
        this.logger.info(`Fetched review count ${count} for book ID ${bookId}`);
        return count;
    }
}

export default ReviewService;
