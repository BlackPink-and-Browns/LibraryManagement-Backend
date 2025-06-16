import { Request, Response, Router, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import ReviewService from '../services/review.service';
import { CreateReviewDto } from '../dto/review/create-review.dto';
import { UpdateReviewDto } from '../dto/review/update-review.dto';
import { ReviewResponseDto } from '../dto/review/response-review.dto';
import httpException from '../exceptions/http.exception';

class ReviewController {
  constructor(private reviewService: ReviewService, router: Router) {
    router.get('/books/:book_id', this.getReviewsByBookId.bind(this));
    router.get('/users/:user_id', this.getReviewsByUserId.bind(this));
    router.post('/', this.createReview.bind(this));
    router.patch('/:id', this.updateReview.bind(this));
    router.delete('/:id', this.deleteReview.bind(this));
  }

  async getReviewsByBookId(req: Request, res: Response, next: NextFunction) {
    try {
      const book_id=Number(req.params.book_id)
      const reviews = await this.reviewService.getReviewsByBookId(book_id);
      const response = plainToInstance(ReviewResponseDto, reviews, {
        excludeExtraneousValues: true,
      });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  }

  async getReviewsByUserId(req: Request, res: Response, next: NextFunction) {
    try {
      const user_id=Number(req.params.user_id);
      const reviews = await this.reviewService.getReviewsByUserId(user_id);
      const response = plainToInstance(ReviewResponseDto, reviews, {
        excludeExtraneousValues: true,
      });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  }

  async createReview(req: Request, res: Response, next: NextFunction) {
    try {
      const createDto = plainToInstance(CreateReviewDto, req.body);
      const errors = await validate(createDto);
      if (errors.length > 0) {
        throw new httpException(400, JSON.stringify(errors));
      }
      const userId=Number(req.user.id);
      const createdReview = await this.reviewService.createReview(createDto,userId);
      const response = plainToInstance(ReviewResponseDto, createdReview, {
        excludeExtraneousValues: true,
      });
      res.status(201).send(response);
    } catch (err) {
      next(err);
    }
  }

  async updateReview(req: Request, res: Response, next: NextFunction) {
    try {
      const updateDto = plainToInstance(UpdateReviewDto, req.body);
      const errors = await validate(updateDto);
      if (errors.length > 0) {
        throw new httpException(400, JSON.stringify(errors));
      }
      const review_id=Number(req.params.id);
      console.log(review_id)
      const updated = await this.reviewService.updateReview(review_id, updateDto,req.user?.id);
      const response = plainToInstance(ReviewResponseDto, updated, {
        excludeExtraneousValues: true,
      });
      res.status(200).send(response);
    } catch (err) {
      next(err);
    }
  }

  async deleteReview(req: Request, res: Response, next: NextFunction) {
    try {
      await this.reviewService.deleteReview(req.params.id,req.user?.id);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export default ReviewController;
