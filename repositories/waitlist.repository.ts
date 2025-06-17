import { Repository } from "typeorm";
import { Waitlist } from "../entities/waitlist.entity";

class WaitlistRepository {
  constructor(private repository: Repository<Waitlist>) {}

  async create(waitlist: Waitlist): Promise<Waitlist> {
    return this.repository.save(waitlist);
  }

  async findAllByEmployeeId(employee_id: number) {
    return this.repository.find({
      where: { employeeId: employee_id },
      select: {
        id: true,
        employeeId: true,
        status: true,
        book: {
          id: true,
          title: true
        }
      },
      relations: { book: true },
    });
  }
}

export default WaitlistRepository;
