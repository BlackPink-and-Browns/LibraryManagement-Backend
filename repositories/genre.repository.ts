import { In, Repository } from "typeorm";
import { Genre } from "../entities/genre.entity";
import { BorrowStatus, WaitlistStatus } from "../entities/enums";

class GenreRepository {
  constructor(private repository: Repository<Genre>) {}

  async create(genre: Genre): Promise<Genre> {
    return this.repository.save(genre);
  }

  async findOneByID(id: number): Promise<any> {
    const genre = await this.repository.findOne({
      where: { id },
      select: {
        id:true,
        name:true,
        description:true,
        books:{
            id:true,
            isbn:true,
            title:true,
            cover_image:true,
            description:true
        }
      },
      relations: {
        books: true,
      },
    });

    if (!genre) return null;

    return genre;
  }

  async findAll(): Promise<any[]> {
    const genres = await this.repository.find({
      select: {
        id:true,
        name:true,
        description:true,
        books:{
            id:true,
            isbn:true,
            title:true,
            cover_image:true,
            description:true
        }
      },
      relations: {
        books: true,
      },
    });

    return genres;
  }

  async remove(genre: Genre): Promise<void> {
    if (!genre.id) {
      throw new Error("Genre entity must have an id to be removed.");
    }
    await this.repository.remove(genre);
  }

  async findPopular(take: number = 3, descriptive: boolean = false) {
      const now = new Date();
      const oneMonthAgo = new Date();
      oneMonthAgo.setMonth(now.getMonth() - 1);

      const popularityResults = await this.repository
          .createQueryBuilder('genre')
          .leftJoin('genre.books', 'book')
          .leftJoin('book.copies', 'copy')
          .leftJoin('copy.borrowRecords', 'borrow', `
              borrow.borrowed_at >= :startDate AND
              borrow.status = :borrowStatus
          `, { startDate: oneMonthAgo, borrowStatus: BorrowStatus.BORROWED })
          .leftJoin('waitlist', 'waitlist', `
              waitlist.book_id = book.id AND
              waitlist.status = :waitlistStatus
          `, { waitlistStatus: WaitlistStatus.REQUESTED })
          .select('genre.id', 'id')
          .addSelect('genre.name', 'name')
          .addSelect('COUNT(DISTINCT borrow.id)', 'borrow_count')
          .addSelect(`
              COUNT(DISTINCT CASE
                WHEN waitlist."created_at" >= :startDate THEN waitlist.id
                ELSE NULL
              END)
          `, 'waitlist_count')
          .addSelect(`
              COUNT(DISTINCT borrow.id) +
              COUNT(DISTINCT CASE
                WHEN waitlist."created_at" >= :startDate THEN waitlist.id
                ELSE NULL
              END)
          `, 'popularity_score')
          .groupBy('genre.id')
          .orderBy('popularity_score', 'DESC')
          .limit(take)
          .setParameter('startDate', oneMonthAgo)
          .getRawMany();


      if (descriptive) {
          const genreIds = popularityResults.map(g => g.id);
          const detailedGenres = await this.repository.find({
              where: {
                  id: In(genreIds)
              },
              select: {
                  id: true,
                  name: true,
                  description: true,
                  books: {
                      id: true,
                      isbn: true,
                      title: true,
                      cover_image: true,
                      description: true
                  }
              },
              relations: {
                  books: true
              }
          });

          const genreMap = Object.fromEntries(detailedGenres.map(g => [g.id, g]));
          return genreIds.map(id => genreMap[id]);
      }

      return popularityResults;
  }

  async list(): Promise<Genre[]> {
      return await this.repository.find({select: {name: true }})
    }

  async findManyByName(names: string[]) {
      return this.repository.find({
          where: {
            name: In(names)
          },
          select: {
            id: true,
            name: true
          }
          
      })
    }

}

export default GenreRepository;
