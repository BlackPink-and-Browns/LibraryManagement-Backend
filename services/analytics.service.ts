import { BorrowStatus } from "../entities/enums";
import AuditLogRepository from "../repositories/audit.repository";
import BookRepository from "../repositories/book.repository";
import BorrowRecordRepository from "../repositories/borrow.repository";
import GenreRepository from "../repositories/genre.repository";
import ShelfRepository from "../repositories/shelf.repository";
import { LoggerService } from "./logger.service";

class AnalyticsService {
  private logger = LoggerService.getInstance(AnalyticsService.name);

  constructor(
    private bookRepository: BookRepository,
    private shelfRepository: ShelfRepository,
    private auditLogRepository: AuditLogRepository,
    private borrowRepository: BorrowRecordRepository,
    private genreRepository: GenreRepository,
) {}

async getDashboardSummary(){
  const booksCount = await this.bookRepository.totalCount({previousCount: true});
  const activeUsersCount = 0;
  const shelvesCount = await this.shelfRepository.totalCount({previousCount: true});
  const issuedBooksCount = await this.borrowRepository.findCountByStatus({status: BorrowStatus.BORROWED, previousCount: true});
  const recentActivity = await this.auditLogRepository.findAll( undefined, undefined, 5 );
  const recentlyAddedBooks = await this.bookRepository.findRecentlyCreated(3);

  const popularBooks = await this.bookRepository.findPopular();
  const popularGenres = await this.genreRepository.findPopular();

  return {
    booksCount,
    activeUsersCount,
    shelvesCount,
    issuedBooksCount,
    recentActivity,
    recentlyAddedBooks,
    popularBooks,
    popularGenres
  };
};

}


export default AnalyticsService;