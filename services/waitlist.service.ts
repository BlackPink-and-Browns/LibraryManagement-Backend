import { LoggerService } from "./logger.service";
import httpException from "../exceptions/http.exception";
import { auditLogService } from "../routes/audit.route";
import WaitlistRepository from "../repositories/waitlist.repository";
import { Waitlist } from "../entities/waitlist.entity";
import BookRepository from "../repositories/book.repository";
import { WaitlistStatus } from "../entities/enums";
import { Notification } from "../entities/notification.entity";

class WaitlistService {
  private logger = LoggerService.getInstance(WaitlistService.name);

  constructor(
    private waitlistRepository: WaitlistRepository,
    private bookRepository: BookRepository
) {}

  async createWaitlist(book_id: number, user_id: number): Promise<Waitlist> {
    const newWaitListEntry = new Waitlist();
    const book = await this.bookRepository.findPreviewByID(book_id)
    if (!book) {
            this.logger.error("book not found");
            throw new httpException(400, "Book not found");
        }
    newWaitListEntry.book = book;
    newWaitListEntry.employeeId = user_id;
    newWaitListEntry.status = WaitlistStatus.REQUESTED;
    const createdWaitListEntry = this.waitlistRepository.create(newWaitListEntry);

    auditLogService.createAuditLog(
        "CREATE",
        user_id,
        (await createdWaitListEntry).id.toString(),
        "WAITLIST"
    );

    this.logger.info("waitlist created");
    return createdWaitListEntry
  }
}

export default WaitlistService;