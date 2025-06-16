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

  async findByBookId(bookId: number): Promise<Review[]> {
    return this.repository.find({
      where: {
        book: {
          id: bookId,
        },
      },
      relations: {
        book: true,
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
      relations: {
        book: true,
        employee: true,
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
