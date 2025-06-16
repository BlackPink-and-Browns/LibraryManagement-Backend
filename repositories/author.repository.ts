import { Repository } from "typeorm";
import { Author } from "../entities/author.entity";
import { Review } from "../entities/review.entity";
import { BookCopy } from "../entities/bookcopy.entity";

class AuthorRepository {
  constructor(private repository: Repository<Author>) {}

  async create(author: Author): Promise<Author> {
    return this.repository.save(author);
  }

  async findAll(): Promise<Author[]> {
    return this.repository
      .createQueryBuilder("author")
      .leftJoin("author.books", "book")
      .select("author.id", "id")
      .addSelect("author.name", "name")
      .addSelect("COUNT(book.id)", "bookCount")
      .groupBy("author.id")
      .getRawMany();
  }

  async findDetailedByID(id: number): Promise<Author> {
    return this.repository.findOne({
      where: { id },
      select: {
        id: true,
        name: true,
        books: {
          id: true,
          title: true,
          isbn: true,
          description: true,
          cover_image: true,
          genres: {
            id: true,
            name: true,
          },
          reviews: {
            id: true,
            rating: true,
          },
          copies: {
            id: true,
            is_available: true,
          }
        },
      },
      relations: {
        books: {
          genres: true,
          reviews: true,
          copies: true,
        },
      },
    });
  }

  async findOneByID(id: number): Promise<Author> {
    return this.repository.findOne({
        where: { id },
        select: {
            id: true,
            name: true
        }
    });
  }

  async update(id: number, author: Author): Promise<void> {
    await this.repository.save({ id, ...author });
  }

  // async delete (id: number) : Promise<void> {
  //     await this.repository.delete({id})
  // }

  // async remove(employee : Employee) : Promise<void> {
  //     await this.repository.remove(employee)
  // }
}

export default AuthorRepository;
