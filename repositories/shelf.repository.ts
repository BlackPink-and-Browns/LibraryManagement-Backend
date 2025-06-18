import { Repository } from "typeorm";
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
}

export default ShelfRepository;
