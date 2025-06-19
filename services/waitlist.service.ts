import { LoggerService } from "./logger.service";
import httpException from "../exceptions/http.exception";
import { auditLogService } from "../routes/audit.route";
import WaitlistRepository from "../repositories/waitlist.repository";
import { Waitlist } from "../entities/waitlist.entity";
import BookRepository from "../repositories/book.repository";
import { AuditLogType, EntityType, NotificationType, WaitlistStatus } from "../entities/enums";
import { Notification } from "../entities/notification.entity";
import datasource from "../db/data-source";
import BorrowRecordRepository from "../repositories/borrow.repository";
import { borrowRepository, borrowService } from "../routes/borrow.route";
import Employee from "../entities/employee.entity";
import { notificationService } from "../routes/notification.route";

class WaitlistService {
    private entityManager = datasource.manager;
    private logger = LoggerService.getInstance(WaitlistService.name);

    constructor(
        private waitlistRepository: WaitlistRepository,
        private bookRepository: BookRepository
    ) {}

    async createWaitlist(book_id: number, user_id: number): Promise<Waitlist> {
        const book = await this.bookRepository.findPreviewByID(book_id);
        if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        } else if (book.is_available) {
            this.logger.error("book is available")
            throw new httpException(400, "Books is already available, no need to wait")
        }
        const existingWaitlist = await this.waitlistRepository.findPreviewByID(
            user_id,
            book
        );
        const borrowRecords = await borrowRepository.findBorrowRecordsByBookId(
            book.id
        );
        const usersWithBook: number[] = borrowRecords.map((borrowRecord) => {
            return borrowRecord.borrowedBy.id;
        });
        if (existingWaitlist) {
            if (existingWaitlist.status === WaitlistStatus.REQUESTED) {
                throw new httpException(400, "Book has already been requested by user")
            }
            existingWaitlist.status = WaitlistStatus.REQUESTED;
            await this.waitlistRepository.updateSelectedItems(
                user_id,
                [existingWaitlist.id],
                WaitlistStatus.REQUESTED
            );
            const message = `A user has requested for the book - ${book.title}`;
            await notificationService.createMultpleRequestNotifications(
                usersWithBook,
                message
            );
            this.logger.info("waitlist updated - changed REMOVED to REQUESTED");
        } else {
            const newWaitListEntry = new Waitlist();
            newWaitListEntry.book = book;
            newWaitListEntry.employeeId = user_id;
            newWaitListEntry.status = WaitlistStatus.REQUESTED;

            const message = `A user has requested for the book - ${book.title}`;
            await notificationService.createMultpleRequestNotifications(
                usersWithBook,
                message
            );
            // const newNotification = new Notification();
            // newNotification.message = `A new user has requested for the book - ${book.title}`;
            // newNotification.type =
            return await this.entityManager.transaction(async (manager) => {
                const m = manager.getRepository(Waitlist);
                const createdWaitListEntry = m.save(newWaitListEntry);
                const error = await auditLogService.createAuditLog(
                    AuditLogType.CREATE,
                    user_id,
                    (await createdWaitListEntry).id.toString(),
                    EntityType.WAITLIST,
                    manager
                );
                if (error.error || notificationCreate.error ) {
                    const throwError = error.error ? error.error : notificationCreate.error
                    throw throwError;
                }

                this.logger.info("waitlist created");
                return createdWaitListEntry;
            });
        }
    }

    async getAllWaitlistByEmployeeId(
        user_id: number,
        status?: WaitlistStatus | ""
    ): Promise<Waitlist[]> {
        const waitlists = await this.waitlistRepository.findAllByEmployeeId(
            user_id,
            status
        );
        this.logger.info("Waitlist array returned");
        return waitlists;
    }

    async updateWaitlist(
        user_id: number,
        DeleteWaitlistRequestsDto
    ): Promise<void> {
        if (DeleteWaitlistRequestsDto.waitlistIds.length === 0) {
            await this.waitlistRepository.updateAllByEmployeeId(user_id);
            this.logger.info(`Updated all waitlists of user`);
        } else {
            await this.waitlistRepository.updateSelectedItems(
                user_id,
                DeleteWaitlistRequestsDto.waitlistIds,
                WaitlistStatus.REMOVED
            );
            this.logger.info(
                `Updated given waitlists of user`
            );
        }
    }
}

export default WaitlistService;
