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
  EntityType,
  NotificationType,
  WaitlistStatus,
} from "../entities/enums";
import { Notification } from "../entities/notification.entity";
import NotificationRepository from "../repositories/notification.repository";
import datasource from "../db/data-source";
import WaitlistRepository from "../repositories/waitlist.repository";
import BookRepository from "../repositories/book.repository";
import { Book } from "../entities/book.entity";

class BorrowService {
  private entityManager = datasource.manager;
  private logger = LoggerService.getInstance(BorrowService.name);

  constructor(
    private borrowRepo: BorrowRecordRepository,
    private bookCopyRepo: BookCopyRepository,
    private employeeRepo: EmployeeRepository,
    private shelfRepo: ShelfRepository,
    private notificationRepo: NotificationRepository,
    private waitlistRepo: WaitlistRepository,
    private bookRepo: BookRepository
  ) {}

  async borrowBook(createDto: CreateBorrowDto, userId?: number): Promise<void> {
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

    const existingBorrow = await this.borrowRepo.findBorrowedCopy(bookCopyId);
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

    // 🟡 1. Mark this copy as unavailable
    bookCopy.is_available = false;
    await this.bookCopyRepo.update(bookCopy.id, bookCopy);

    // 🟡 2. Check if ALL other copies of the book are also unavailable
    const bookId = bookCopy.book.id;
    const otherCopies = await this.bookCopyRepo.findCopiesByBookID(bookId); // You should implement this method

    const allUnavailable = otherCopies.every((copy) => !copy.is_available);
    if (allUnavailable) {
      const book = await this.bookRepo.findOneByID(bookId);
      if (book) {
        book.is_available = false;
        await this.bookRepo.update(bookId, book); // Pass full entity
      }
    }

    const borrow = new BorrowRecord();
    borrow.bookCopy = bookCopy;
    borrow.borrowedBy = employee;
    borrow.borrowed_at = new Date();
    borrow.status = BorrowStatus.BORROWED;
    borrow.expires_at = new Date(
      borrow.borrowed_at.getTime() + 7 * 24 * 60 * 60 * 1000
    );
    await this.entityManager.transaction(async (manager) => {
      const m = manager.getRepository(BorrowRecord);
      const savedBorrow = await m.save(borrow);

      const error = await auditLogService.createAuditLog(
        AuditLogType.CREATE,
        userId,
        savedBorrow.id.toString(),
        EntityType.BORROW_RECORD,
        manager
      );
      if (error.error) {
        throw error.error;
      }
      this.logger.info(`Book borrowed with borrow ID ${savedBorrow.id}`);

      // 🟢 3. Check and update waitlist status accordingly
      const existingWaitlist = await this.waitlistRepo.findByBookAndEmployee(
        bookId,
        employeeId
      );

      if (existingWaitlist) {
        if (existingWaitlist.status === WaitlistStatus.NOTIFIED) {
          // If it's currently NOTIFIED, move back to REQUESTED before fulfilling
          await this.waitlistRepo.update(existingWaitlist.id, {
            status: WaitlistStatus.REQUESTED,
          });
          this.logger.info(
            `Waitlist status for book ${bookId} and employee ${employeeId} changed from NOTIFIED to REQUESTED`
          );
        }

        if (
          existingWaitlist.status !== WaitlistStatus.FULFILLED &&
          existingWaitlist.status !== WaitlistStatus.REMOVED
        ) {
          await this.waitlistRepo.update(existingWaitlist.id, {
            status: WaitlistStatus.FULFILLED,
          });
          this.logger.info(
            `Waitlist for book ${bookId} and employee ${employeeId} marked as fulfilled`
          );
        }
      }
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
        this.logger.error(`Return shelf with id ${returnShelfId} not found`);
        throw new httpException(404, "Return shelf not found");
      }
      borrow.returnShelf = returnShelf;
    }

    // Mark returned
    borrow.returned_at = new Date();
    borrow.status = BorrowStatus.RETURNED;

    await this.entityManager.transaction(async (manager) => {
      const m = manager.getRepository(BorrowRecord);
      const b = manager.getRepository(BookCopy);

      await m.save({ id, ...borrow });

      // ✅ Mark the returned BookCopy as available
      const bookCopy = borrow.bookCopy;
      if (bookCopy) {
        bookCopy.is_available = true;
        await b.save({ id: bookCopy.id, ...bookCopy });

        // ✅ If the parent Book is marked unavailable, check and make it available
        const bookId = bookCopy.book.id;
        const book = bookCopy.book;

        if (!book.is_available) {
          book.is_available = true;
          await b.save({ id: bookId, ...book });
        }
      }

      const error = await auditLogService.createAuditLog(
        AuditLogType.UPDATE,
        userId,
        borrow.id.toString(),
        EntityType.BORROW_RECORD,
        manager
      );

      if (error.error) {
        throw error.error;
      }
      this.logger.info(`Book with borrow ID ${id} returned successfully`);
    });

    const book = borrow.bookCopy?.book;
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

      for (const [employeeId, waitlistIds] of employeeWaitlistMap.entries()) {
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
      throw new httpException(400, "Only overdue records can be reborrowed");
    }

    borrow.status = BorrowStatus.BORROWED;
    borrow.expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    return await this.entityManager.transaction(async (manager) => {
      const m = manager.getRepository(BorrowRecord);
      await m.save({ id, ...borrow });

      const error = await auditLogService.createAuditLog(
        AuditLogType.UPDATE,
        userId,
        borrow.id.toString(),
        EntityType.BORROW_RECORD,
        manager
      );
      if (error.error) {
        throw error.error;
      }
      this.logger.info(`Overdue borrow record ${id} set to BORROWED again`);
      return borrow;
    });
  }

  async getOverdueAlerts(): Promise<BorrowRecord[]> {
    const overdues = await this.borrowRepo.findUnalertedOverdues();

    this.logger.info(`Fetched ${overdues.length} overdue alerts`);
    return overdues;
  }

  async checkAndReturnOverdues(
    employeeId: number,
    user_id?: number
  ): Promise<{ result: BorrowRecord[]; count: number }> {
    const employee = await this.employeeRepo.findOneByID(employeeId);
    if (!employee) {
      throw new httpException(404, "Employee not found");
    }

    // Step 1: Fetch all borrowed books (with book details)
    const borrowedRecords = await this.borrowRepo.findBorrowedBooksByEmployee(
      employeeId
    );

    const now = new Date();
    const toUpdate: BorrowRecord[] = [];

    // Step 2: Check for overdue records and update them
    for (const record of borrowedRecords) {
      const expiresAt = record.expires_at;
      if (
        expiresAt &&
        now > expiresAt &&
        record.status !== BorrowStatus.OVERDUE
      ) {
        record.status = BorrowStatus.OVERDUE;
        record.overdue_alert_sent = true;
        toUpdate.push(record);

        await this.entityManager.transaction(async (manager) => {
          const m = manager.getRepository(BorrowRecord);

          await m.save({
            id: record.id,
            status: BorrowStatus.OVERDUE,
            overdue_alert_sent: true,
          });

          const bookTitle =
            record.bookCopy?.book?.title || `Book #${record.bookCopy?.id}`;
          const notification = new Notification();
          notification.employee = employee;
          notification.message = `The book "${bookTitle}" is overdue. Please return it as soon as possible.`;
          notification.type = NotificationType.BOOK_OVERDUE;
          notification.read = false;

          const notifRepo = manager.getRepository(Notification);
          const savedNotif = await notifRepo.save(notification);

          const borrowLog = await auditLogService.createAuditLog(
            AuditLogType.UPDATE,
            user_id,
            record.id.toString(),
            EntityType.BORROW_RECORD,
            manager
          );
          if (borrowLog.error) throw borrowLog.error;

          const notifLog = await auditLogService.createAuditLog(
            AuditLogType.CREATE,
            user_id,
            savedNotif.id.toString(),
            EntityType.NOTIFICATION,
            manager
          );
          if (notifLog.error) throw notifLog.error;

          this.logger.info(
            `Borrow ${record.id} marked as OVERDUE and notification ${savedNotif.id} created`
          );
        });
      }
    }

    // Step 3: Fetch updated overdue records after marking them
    const overdueRecords = await this.borrowRepo.findByStatusAndUser(
      employeeId,
      BorrowStatus.OVERDUE
    );

    this.logger.info(
      `Found ${overdueRecords.count} overdue borrow records for employee ${employeeId}`
    );

    return {
      result: overdueRecords.records,
      count: overdueRecords.count,
    };
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

  async getBorrowsByStatusForAllUsers(
    status: BorrowStatus
  ): Promise<BorrowRecord[]> {
    return await this.borrowRepo.findAllByStatus(status);
  }
}

export default BorrowService;
