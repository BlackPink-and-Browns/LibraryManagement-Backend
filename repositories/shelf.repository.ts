import { In, IntegerType, LessThan, Repository } from "typeorm";
import { Shelf } from "../entities/shelf.entity";

class ShelfRepository {
  constructor(private repository: Repository<Shelf>) {}

  async create(shelf: Shelf): Promise<Shelf> {
    return this.repository.save(shelf);
  }

  async findOneByID(id: number): Promise<Shelf | null> {
    return this.repository.findOne({
      where: { id },
      select: {
        id: true,
        label: true,
        office: {
          id: true,
          name: true,
          address: true,
        },
        bookCopies: {
          id: true,
          is_available: true,
          book: {
            id: true,
            title: true,
            isbn: true,
            description: true,
          },
        },
      },
      relations: {
        office: true,
        bookCopies: {
          book: true,
        },
      },
    });
  }
  async findAll(): Promise<Shelf[]> {
    return this.repository.find({
      select: {
        id: true,
        label: true,
        office: {
          id: true,
          name: true,
          address: true,
        },
        bookCopies: {
          id: true,
          is_available: true,
          book: {
            id: true,
            title: true,
            isbn: true,
            description: true,
          },
        },
      },
      relations: {
        office: true,
        bookCopies: {
          book: true,
        },
      },
    });
  }

  async update(id: number, shelf: Shelf): Promise<void> {
    await this.repository.save({ id, ...shelf });
  }

  async remove(shelf: Shelf): Promise<void> {
    await this.repository.remove(shelf);
  }

  async countAll(): Promise<number> {
    return this.repository.count();
  }

  async totalCount({previousCount = false}: {previousCount?: boolean}): Promise<{ totalCount: number; previousMonthCount?: number; }> {
      const totalCount = await this.repository.count();
      if (previousCount) {
          const now = new Date();
          const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);

          const previousMonthCount = await this.repository.count({
              where: {
              createdAt: LessThan(startOfCurrentMonth),
              },
          });
          return {
              totalCount,
              previousMonthCount,
          };
      }
      return {totalCount}
  }

  async list(): Promise<Shelf[]> {
      return await this.repository.find({select: {label: true }})
    }

    async findManyByLabel(labels: string[]) {
      return this.repository.find({
          where: {
            label: In(labels)
          },
          select: {
            id: true,
            label: true
          }
          
      })
    }

}

export default ShelfRepository;
