import { LessThan, Repository } from "typeorm";
import { BorrowRecord } from "../entities/borrowrecord.entity";
import { BorrowStatus } from "../entities/enums";

class BorrowRecordRepository {
  constructor(private repository: Repository<BorrowRecord>) {}

  async create(record: BorrowRecord): Promise<BorrowRecord> {
    return this.repository.save(record);
  }

  async findOneByID(id: number): Promise<BorrowRecord | null> {
    return this.repository.findOne({
      where: { id },
      select: {
        id: true,
        borrowed_at: true,
        returned_at: true,
        status: true,
        overdue_alert_sent: true,
        bookCopy: {
          id: true,
        },
        borrowedBy: {
          id: true,
          name: true,
        },
        returnShelf: {
          id: true,
          label: true,
        },
      },
      relations: {
        bookCopy: {
          book: true,
        },
        borrowedBy: true,
        returnShelf: true,
      },
    });
  }

  async findBorrowedCopy(copyId: number): Promise<BorrowRecord | null> {
    return this.repository.findOne({
      where: {
        bookCopy: { id: copyId },
        status: BorrowStatus.BORROWED,
      },
      select: {
        id: true,
        status: true,
        bookCopy: {
          id: true,
        },
      },
      relations: {
        bookCopy: true,
      },
    });
  }

  async hasOverdues(employeeId: number): Promise<boolean> {
    const count = await this.repository.count({
      where: {
        borrowedBy: { id: employeeId },
        status: BorrowStatus.OVERDUE,
      },
    });
    return count > 0;
  }

  async update(id: number, record: BorrowRecord): Promise<void> {
    await this.repository.save({ id, ...record });
  }

  async findUnalertedOverdues(): Promise<BorrowRecord[]> {
    return this.repository.find({
      where: {
        status: BorrowStatus.OVERDUE,
        overdue_alert_sent: false,
      },
      select: {
        id: true,
        borrowed_at: true,
        status: true,
        overdue_alert_sent: true,
        borrowedBy: {
          id: true,
          name: true,
        },
        bookCopy: {
          id: true,
        },
      },
      relations: {
        borrowedBy: true,
        bookCopy: true,
      },
    });
  }

  async findBorrowedBooksByEmployee(
    employeeId: number
  ): Promise<BorrowRecord[]> {
    return this.repository.find({
      where: {
        borrowedBy: { id: employeeId },
        status: BorrowStatus.BORROWED,
      },
      select: {
        id: true,
        borrowed_at: true,
        expires_at: true,
        status: true,
        returned_at: true,
        returnShelf: true,
        borrowedBy: true,
        bookCopy: {
          id: true,
          book: {
            title: true,
            isbn: true,
            authors: true,
            avg_rating: true,
            cover_image: true,
            description: true,
          },
        },
      },
      relations: {
        bookCopy: {
          book: true,
        },
      },
    });
  }

  async findBorrowRecordsByBookId(book_id: number): Promise<BorrowRecord[]> {
    return this.repository.find({
      where: {
        bookCopy: { book: { id: book_id } },
        status: BorrowStatus.BORROWED,
      },
      relations: {
        // borrowedBy: true,
        bookCopy: {
          book: true,
        },
      },
      select: {
        id: true,
        status: true,
        bookCopy: {
          id: true,
          book: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async findByStatusAndUser(
    userId: number,
    status: BorrowStatus
  ): Promise<{ records: BorrowRecord[]; count: number }> {
    const [records, totalCount] = await this.repository.findAndCount({
      where: {
        borrowedBy: { id: userId },
        status,
      },
      select: {
        id: true,
        borrowed_at: true,
        returned_at: true,
        status: true,
        bookCopy: {
          id: true,
          is_available: true,
          book: {
            id: true,
            title: true,
            cover_image: true,
          },
        },
        borrowedBy: {
          id: true,
          name: true,
          email: true,
        },
      },
      relations: {
        bookCopy: {
          book: true,
        },
        borrowedBy: true,
      },
      order: {
        borrowed_at: "DESC",
      },
    });

    return {
      count: totalCount,
      records,
    };
  }

  async findCountByStatus({
    status,
    previousCount = false,
  }: {
    status: BorrowStatus;
    previousCount?: boolean;
  }) {
    const countByStatus = await this.repository.count({
      where: { status: status },
    });
    if (previousCount) {
      const now = new Date();
      const startOfCurrentMonth = new Date(
        now.getFullYear(),
        now.getMonth(),
        1
      );

      const previousMonthCount = await this.repository.count({
        where: {
          status: status,
          createdAt: LessThan(startOfCurrentMonth),
        },
      });
      return {
        countByStatus,
        previousMonthCount,
      };
    }
    return { countByStatus };
  }

  async findAllByStatus(status: BorrowStatus): Promise<BorrowRecord[]> {
    return this.repository.find({
      where: { status },
      relations: {
        bookCopy: {
          book: true,
        },
        borrowedBy: true,
        returnShelf: true,
      },
      order: {
        borrowed_at: "DESC",
      },
    });
  }
  async findBorrowRecordsByEmployeeId(
    employeeId: number
  ): Promise<BorrowRecord[]> {
    return this.repository.find({
      where: {
        borrowedBy: { id: employeeId },
      },
       select: {
        id: true,
        status: true,
        borrowedBy:true,
        bookCopy: {
          id: true,
          book: {
            id:true,
            is_available: true,
            title: true,
            genres: {
              id: true,
              name: true
            },
            authors: {
              id: true,
              name: true,
            },
            avg_rating:true,
          },
        },
      },
      relations: {
        bookCopy: {
          book: {
            genres:true,
            authors: true
          },
        },
      },
    });
  }

}

export default BorrowRecordRepository;
