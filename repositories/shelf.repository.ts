import { IntegerType, LessThan, Repository } from "typeorm";
import { Shelf } from "../entities/shelf.entity";

class ShelfRepository {
  constructor(private repository: Repository<Shelf>) {}

  async create(shelf: Shelf): Promise<Shelf> {
    return this.repository.save(shelf);
  }

  async findOneByID(id: number): Promise<Shelf | null> {
    return this.repository.findOne({
      where: { id },
      relations: {
        office: true,
        bookCopies:true
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
        },
      },
      relations: {
        office: true,
        bookCopies:true
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

}

export default ShelfRepository;
