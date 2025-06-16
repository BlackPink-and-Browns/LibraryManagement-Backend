import { Repository } from "typeorm";
import { Review } from "../entities/review.entity";

class ReviewRepository {
  constructor(private repository: Repository<Review>) {}

  async create(review: Review): Promise<Review> {
    return this.repository.save(review);
  }

  async findOneByID(id: number): Promise<Review | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        book: true,
        employee: true,
      },
    });
  }

  async findMany(): Promise<Review[]> {
    return this.repository.find({
      select: {
        id: true,
        rating: true,
        content: true,
        createdAt: false,
        book: {
          id: true,
          title: true,
          isbn: false,
        },
        employee: {
          id: true,
          name: true,
          email: false,
        },
      },
      relations: {
        book: true,
        employee: true,
      },
    });
  }

  async findByBookId(bookId: number): Promise<Review[]> {
    return this.repository.find({
      where: {
        book: {
          id: bookId,
        },
      },
      select: {
        id: true,
        rating: true,
        content: true,
        createdAt: false,
        employee: {
          id: true,
          name: true,
        },
      },
      relations: {
        employee: true,
      },
    });
  }

  async findByUserId(userId: number): Promise<Review[]> {
    return this.repository.find({
      where: {
        employee: {
          id: userId,
        },
      },
      select: {
        id: true,
        rating: true,
        content: true,
        createdAt: false,
        book: {
          id: true,
          title: true,
        },
      },
      relations: {
        book: true,
      },
    });
  }

  async findByBookIdAndUserId(
    bookId: number,
    userId: number
  ): Promise<Review | null> {
    return this.repository.findOne({
      where: {
        book: { id: bookId },
        employee: { id: userId },
      },
      relations: {
        book: true,
        employee: true,
      },
    });
  }

  async update(id: number, review: Review): Promise<void> {
    await this.repository.save({ id, ...review });
  }

  async remove(review: Review): Promise<void> {
    await this.repository.remove(review);
  }
}

export default ReviewRepository;
