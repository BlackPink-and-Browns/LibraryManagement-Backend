import { In, IntegerType, Repository } from "typeorm";
import { Waitlist } from "../entities/waitlist.entity";
import { WaitlistStatus } from "../entities/enums";
import { Book } from "../entities/book.entity";

class WaitlistRepository {
  constructor(private repository: Repository<Waitlist>) {}

  async create(waitlist: Waitlist): Promise<Waitlist> {
    return this.repository.save(waitlist);
  }

  async findAllByEmployeeId(employee_id: number, status?: WaitlistStatus | "") {
    return this.repository.find({
      where: {
        employeeId: employee_id,
        ...(status && { status: status }),
      },
      order: {
        updatedAt: "DESC",
      },
      select: {
        id: true,
        employeeId: true,
        status: true,
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

  async findAllByBook(book_id: number, status?: WaitlistStatus) {
    return this.repository.find({
      where: {
        book: {
          id: book_id,
        },
        status: status,
      },
      select: {
        id: true,
        employeeId: true,
        status: true,
      },
    });
  }

  async updateAllByEmployeeId(employee_id: number): Promise<void> {
    await this.repository.update(
      { employeeId: employee_id },
      { status: WaitlistStatus.REMOVED }
    );
  }

  async updateSelectedItems(
    employee_id: number,
    waitlistIds: number[],
    status: WaitlistStatus
  ): Promise<void> {
    await this.repository.update(
      {
        id: In(waitlistIds),
        employeeId: employee_id,
      },
      {
        status: status,
        notification: true
      }
    );
  }

  async findPreviewByID(employeeId: number, book: Book): Promise<Waitlist> {
      return this.repository.findOne({
          where: {
            employeeId: employeeId,
            book: book
          },
          select: {
              id: true,
              status: true,
          }
      })
  }

  async findByBookAndEmployee(
    bookId: number,
    employeeId: number
  ): Promise<Waitlist | null> {
    return await this.repository.findOne({
      where: {
        book: { id: bookId },
        employee: { id: employeeId },
      },
      relations: {
        book: true,
        employee: true,
      },
    });
  }

  async update(id: number, data: Partial<Waitlist>): Promise<void> {
    await this.repository.update(id, data);
  }
}

export default WaitlistRepository;
