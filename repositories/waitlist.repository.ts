import { In, Repository } from "typeorm";
import { Waitlist } from "../entities/waitlist.entity";
import { WaitlistStatus } from "../entities/enums";

class WaitlistRepository {
  constructor(private repository: Repository<Waitlist>) {}

  async create(waitlist: Waitlist): Promise<Waitlist> {
    return this.repository.save(waitlist);
  }

  async findAllByEmployeeId(employee_id: number, status?: WaitlistStatus | "") {
    return this.repository.find({
      where: { 
        employeeId: employee_id, 
        ...(status && { status: status })
      },
      order:{
        updatedAt: "DESC",
      },
      select: {
        id: true,
        employeeId: true,
        status: true,
        book: {
          id: true,
          title: true
        }
      },
      relations: { 
        book: true 
      },
    });
  }

  async updateAllByEmployeeId(employee_id: number) : Promise<void> {
        await this.repository.update(
          {employeeId: employee_id},
          { status: WaitlistStatus.REMOVED }
        )
    }

  async updateSelectedItems(employee_id: number, waitlistIds: number[]) : Promise<void> {
    await this.repository.update(
      {
        id: In(waitlistIds),
        employeeId: employee_id,
      },
      {
        status: WaitlistStatus.REMOVED
      }
    )
  }
}

export default WaitlistRepository;
