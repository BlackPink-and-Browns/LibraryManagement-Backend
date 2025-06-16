import { Repository } from "typeorm";
import { Office } from "../entities/office.entity";

class OfficeRepository {
  constructor(private repository: Repository<Office>) {}

  async findOneByID(id: number): Promise<Office | null> {
    return this.repository.findOne({
      where: { id },
    });
  }

  async findAll(): Promise<Office[]> {
    return this.repository.find({
      select: {
        id: true,
        name: true,
        address:true,
        shelves:true
      },
    });
  }
}

export default OfficeRepository;
