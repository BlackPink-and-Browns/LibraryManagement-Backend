import { Repository } from "typeorm";
import Employee from "../entities/employee.entity";
import { EmployeeLibraryResponseDto } from "../dto/employee/employee-library-response.dto";
import { borrowRepository, borrowService } from "../routes/borrow.route";
import { BorrowStatus, WaitlistStatus } from "../entities/enums";
import { Book } from "../entities/book.entity";
import { BookCopy } from "../entities/bookcopy.entity";
import { BorrowRecord } from "../entities/borrowrecord.entity";

class EmployeeRepository {
    constructor(private repository: Repository<Employee>) {}

    async create(employee: Employee): Promise<Employee> {
        return this.repository.save(employee);
    }

    async findAll(): Promise<Employee[]> {
        return this.repository.find({
            relations: {
                address: true,
                department: true,
            },
        });
    }

    async findOneByEmail(email: string): Promise<Employee | null> {
        return this.repository.findOneBy({ email });
    }

    async findOneByID(id: number): Promise<Employee> {
        return this.repository.findOne({
            where: { id },
            relations: { address: true, department: true },
        });
    }

    async update(id: number, employee: Employee): Promise<void> {
        await this.repository.save({ id, ...employee }); // ... spread
    }

    async delete(id: number): Promise<void> {
        await this.repository.delete({ id });
    }

    async remove(employee: Employee): Promise<void> {
        await this.repository.remove(employee);
    }

    async findBasicEmployeeDetails(id: number): Promise<Employee> {
        return this.repository.findOne({
            where: { id },
            select: {
                id: true,
                name: true,
                email: true,
                department: {
                    name: true,
                },
            },
            relations: { address: true, department: true },
        });
    }

    async findEmployeeLibraryDetails(
        id: number
    ): Promise<EmployeeLibraryResponseDto> {
        const response = new EmployeeLibraryResponseDto();
        const e = await this.repository.findOne({
            where: { id },
            select: {
                id: true,
                email: true,
                name: true,
                borrowRecords: {
                    createdAt: true,
                    expires_at: true,
                    status: true,
                    bookCopy:{
                        id: true,
                        is_available: true,
                        shelf:true,
                        book: {
                            id: true,
                            title: true,
                            cover_image: true,
                            is_available: true,
                            avg_rating: true,
                            authors: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                waitlistEntries: true,
                notifications: true,
            },
            relations: {
                address: true,
                department: true,
                borrowRecords: {
                    bookCopy:{
                        shelf:true,
                        book:{
                            authors:true
                        }
                    }
                },
                waitlistEntries: true,
                notifications: true,
            },
        });
        let unread_notifications = 0;
        let current_borrowed = 0;
        let current_overdue = 0;
        let current_waitlist = 0;
        let total_borrowed = e.borrowRecords.length;

        const borrowed_books: BorrowRecord[] = [];
        const overdue_books: BorrowRecord[] = [];
        const book_history: BorrowRecord[] = [];

        e.borrowRecords.forEach((borrowRecord) => {
            book_history.push(borrowRecord);
            if (borrowRecord.status === BorrowStatus.BORROWED) {
                current_borrowed += 1;
                borrowed_books.push(borrowRecord);
            }
            if (borrowRecord.status === BorrowStatus.OVERDUE) {
                current_overdue += 1;
                overdue_books.push(borrowRecord);
            }
        });

        e.notifications.forEach((notification) => {
            if (notification.read == false) {
                unread_notifications += 1;
            }
        });

        e.waitlistEntries.forEach((entry) => {
            if (
                entry.status ==
                (WaitlistStatus.REQUESTED || WaitlistStatus.NOTIFIED)
            ) {
                current_waitlist += 1;
            }
        });

        response.id = e.id;
        response.email = e.email;
        response.name = e.name;
        response.current_borrowed = current_borrowed;
        response.current_overdue = current_overdue;
        response.total_borrowed = total_borrowed;
        response.unread_notifications = unread_notifications;
        response.current_waitlist = current_waitlist;
        response.borrowed_books = borrowed_books;
        response.overdue_books = overdue_books;
        response.book_history = book_history;
        return response;
    }
}

export default EmployeeRepository;
