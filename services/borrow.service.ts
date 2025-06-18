import { BorrowRecord } from "../entities/borrowrecord.entity";
import { BookCopy } from "../entities/bookcopy.entity";
import Employee from "../entities/employee.entity";
import { Shelf } from "../entities/shelf.entity";
import BorrowRecordRepository from "../repositories/borrow.repository";
import BookCopyRepository from "../repositories/book-copies.repository";
import EmployeeRepository from "../repositories/employee.repository";
import ShelfRepository from "../repositories/shelf.repository";
import { CreateBorrowDto } from "../dto/borrow/create-borrow.dto";
import httpException from "../exceptions/http.exception";
import { LoggerService } from "./logger.service";
import { auditLogService } from "../routes/audit.route";
import {
    AuditLogType,
    BorrowStatus,
    NotificationType,
    WaitlistStatus,
} from "../entities/enums";
import { Notification } from "../entities/notification.entity";
import NotificationRepository from "../repositories/notification.repository";
import datasource from "../db/data-source";
import WaitlistRepository from "../repositories/waitlist.repository";
import BookRepository from "../repositories/book.repository";

class BorrowService {
    private entityManager = datasource.manager;
    private logger = LoggerService.getInstance(BorrowService.name);

    constructor(
        private borrowRepo: BorrowRecordRepository,
        private bookCopyRepo: BookCopyRepository,
        private employeeRepo: EmployeeRepository,
        private shelfRepo: ShelfRepository,
        private notificationRepo: NotificationRepository,
        private waitlistRepo: WaitlistRepository
    ) {}

    async borrowBook(
        createDto: CreateBorrowDto,
        userId?: number
    ): Promise<BorrowRecord> {
        const { bookCopyId, employeeId } = createDto;

        const bookCopy = await this.bookCopyRepo.findOneByID(bookCopyId);
        if (!bookCopy) {
            this.logger.error(`BookCopy with id ${bookCopyId} not found`);
            throw new httpException(404, "Book copy not found");
        }

        const employee = await this.employeeRepo.findOneByID(employeeId);
        if (!employee) {
            this.logger.error(`Employee with id ${employeeId} not found`);
            throw new httpException(404, "Employee not found");
        }

        const existingBorrow = await this.borrowRepo.findBorrowedCopy(
            bookCopyId
        );
        if (existingBorrow) {
            this.logger.warn(`Book copy ${bookCopyId} is currently borrowed`);
            throw new httpException(400, "Book is currently not available");
        }

        const hasOverdues = await this.borrowRepo.hasOverdues(employeeId);
        if (hasOverdues) {
            this.logger.warn(`Employee ${employeeId} has overdue books`);
            throw new httpException(
                403,
                "Cannot borrow new books with overdue records"
            );
        }

        const borrow = new BorrowRecord();
        borrow.bookCopy = bookCopy;
        borrow.borrowedBy = employee;
        borrow.borrowed_at = new Date();
        borrow.status = BorrowStatus.BORROWED;

        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(BorrowRecord);
            const savedBorrow = await m.save(borrow);

            const error = await auditLogService.createAuditLog(
                AuditLogType.CREATE,
                userId,
                savedBorrow.id.toString(),
                "BORROW_RECORD",
                manager
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info(`Book borrowed with borrow ID ${savedBorrow.id}`);

            return savedBorrow;
        });
    }

    async returnBook(
        id: number,
        returnShelfId?: number,
        userId?: number
    ): Promise<void> {
        const borrow = await this.borrowRepo.findOneByID(id);
        if (!borrow) {
            this.logger.error(`BorrowRecord with id ${id} not found`);
            throw new httpException(404, "Borrow record not found");
        }

        if (borrow.status === BorrowStatus.RETURNED) {
            this.logger.warn(`Borrow record ${id} is already returned`);
            throw new httpException(400, "Book already returned");
        }

        if (returnShelfId) {
            const returnShelf = await this.shelfRepo.findOneByID(returnShelfId);
            if (!returnShelf) {
                this.logger.error(
                    `Return shelf with id ${returnShelfId} not found`
                );
                throw new httpException(404, "Return shelf not found");
            }
            borrow.returnShelf = returnShelf;
        }

        // Mark returned
        borrow.returned_at = new Date();
        borrow.status = BorrowStatus.RETURNED;

        await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(BorrowRecord);

            await m.save({id, ...borrow});

            const error =await auditLogService.createAuditLog(
                "RETURN",
                userId,
                borrow.id.toString(),
                "BORROW_RECORD"
            );

            if (error.error) {
                throw error.error;
            }
            this.logger.info(`Book with borrow ID ${id} returned successfully`);

        });


        const book = borrow.bookCopy?.book;
        console.log("book is", book);
        if (book) {
            const waitlistEntries = await this.waitlistRepo.findAllByBook(
                book.id,
                WaitlistStatus.REQUESTED
            );

            // Group waitlist IDs by employeeId for batch update
            const employeeWaitlistMap = new Map<number, number[]>();

            for (const entry of waitlistEntries) {
                const { employeeId, id: waitlistId } = entry;
                console.log("in for");
                const notification = new Notification();
                notification.employeeId = employeeId;
                notification.message = `The book "${book.title}" you requested is now available.`;
                notification.type = NotificationType.BOOK_AVAILABLE;
                notification.read = false;

                await this.notificationRepo.create(notification);

                if (!employeeWaitlistMap.has(employeeId)) {
                    employeeWaitlistMap.set(employeeId, []);
                }
                employeeWaitlistMap.get(employeeId)!.push(waitlistId);
            }

            for (const [
                employeeId,
                waitlistIds,
            ] of employeeWaitlistMap.entries()) {
                await this.waitlistRepo.updateSelectedItems(
                    employeeId,
                    waitlistIds,
                    WaitlistStatus.NOTIFIED
                );
            }
        } else {
            this.logger.warn(`Book entity not found for borrow ID ${id}`);
        }
    }

    async reborrowOverdueBook(
        id: number,
        userId?: number
    ): Promise<BorrowRecord> {
        const borrow = await this.borrowRepo.findOneByID(id);
        if (!borrow) {
            this.logger.error(`BorrowRecord with id ${id} not found`);
            throw new httpException(404, "Borrow record not found");
        }

        if (borrow.status !== BorrowStatus.OVERDUE) {
            this.logger.warn(`Borrow record ${id} is not in overdue status`);
            throw new httpException(
                400,
                "Only overdue records can be reborrowed"
            );
        }

        borrow.status = BorrowStatus.BORROWED;

        return await this.entityManager.transaction(async (manager) => {
            const m = manager.getRepository(BorrowRecord);
            await m.save({ id, ...borrow });

            const error = await auditLogService.createAuditLog(
                AuditLogType.UPDATE,
                userId,
                borrow.id.toString(),
                "BORROW_RECORD"
            );
            if (error.error) {
                throw error.error;
            }
            this.logger.info(
                `Overdue borrow record ${id} set to BORROWED again`
            );
            return borrow;
        });
    }

    async getOverdueAlerts(): Promise<BorrowRecord[]> {
        const overdues = await this.borrowRepo.findUnalertedOverdues();

        this.logger.info(`Fetched ${overdues.length} overdue alerts`);
        return overdues;
    }

    async checkAndNotifyOverdues(
        employeeId: number,
        user_id?: number
    ): Promise<{ count: number }> {
        const employee = await this.employeeRepo.findOneByID(employeeId);
        if (!employee) {
            throw new httpException(404, "Employee not found");
        }

        const borrowedRecords =
            await this.borrowRepo.findBorrowedBooksByEmployee(employeeId);
        const now = new Date();
        const overdueRecords: BorrowRecord[] = [];

        for (const record of borrowedRecords) {
            const borrowedDate = record.borrowed_at;
            const daysBorrowed = Math.floor(
                (now.getTime() - borrowedDate.getTime()) / (1000 * 60 * 60 * 24)
            );

            if (daysBorrowed > 7 && record.status !== BorrowStatus.OVERDUE) {
                record.status = BorrowStatus.OVERDUE;
                record.overdue_alert_sent = true;
                overdueRecords.push(record);
                await this.entityManager.transaction(async (manager) => {
                    const m = manager.getRepository(BorrowRecord);
                    await m.save({ id: record.id, record });

                    const error = await auditLogService.createAuditLog(
                        AuditLogType.UPDATE,
                        user_id,
                        record.id.toString(),
                        "BORROW_RECORD",
                        manager
                    );
                    if (error.error) {
                        throw error.error;
                    }
                    this.logger.info(
                        `Overdue borrow record ${record.id} set to BORROWED again`
                    );
                });
            }
        }

        for (const overdue of overdueRecords) {
            const notification = new Notification();
            notification.employee = employee;
            const bookTitle =
                overdue.bookCopy?.book?.title ||
                `Book #${overdue.bookCopy?.id}`;
            notification.message = `The book "${bookTitle}" is overdue. Please return it as soon as possible.`;
            notification.type = NotificationType.BOOK_OVERDUE;

            await this.entityManager.transaction(async (manager) => {
                const m = manager.getRepository(Notification);
                await m.save(notification);
                const error = await auditLogService.createAuditLog(
                    AuditLogType.UPDATE,
                    user_id,
                    notification.id.toString(),
                    "NOTIFICATION",
                    manager
                );
                if (error.error) {
                    throw error.error;
                }
                this.logger.info(
                    `Overdue notification ${notification.id} created`
                );
            });
        }

        return { count: overdueRecords.length };
    }

    async getBorrowsByStatus(
        userId: number,
        status: BorrowStatus
    ): Promise<{ records: BorrowRecord[]; count: number }> {
        const employee = await this.employeeRepo.findOneByID(userId);
        if (!employee) {
            this.logger.error(`Employee with id ${userId} not found`);
            throw new httpException(404, "Employee not found");
        }

        const { records, count } = await this.borrowRepo.findByStatusAndUser(
            userId,
            status
        );

        this.logger.info(
            `Fetched ${count} borrow records for user ${userId} with status '${status}'`
        );

        return { records, count };
    }
}

export default BorrowService;
