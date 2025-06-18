import { BorrowStatus } from "../entities/enums";
import AuditLogRepository from "../repositories/audit.repository";
import BookCopyRepository from "../repositories/book-copies.repository";
import BookRepository from "../repositories/book.repository";
import BorrowRecordRepository from "../repositories/borrow.repository";
import EmployeeRepository from "../repositories/employee.repository";
import ShelfRepository from "../repositories/shelf.repository";
import { LoggerService } from "./logger.service";

class AnalyticsService {
  private logger = LoggerService.getInstance(AnalyticsService.name);

  constructor(
    private bookRepository: BookRepository,
    private employeeRepository: EmployeeRepository,
    private shelfRepository: ShelfRepository,
    private bookCopyRepository: BookCopyRepository,
    private auditLogRepository: AuditLogRepository,
    private borrowRepository: BorrowRecordRepository,
) {}

async getDashboardSummary(){
  const totalBooksCount = await this.bookRepository.totalCount();
  const totalShelvesCount = await this.shelfRepository.totalCount();
  const issuedBooksCount = await this.borrowRepository.findCountByStatus(BorrowStatus.BORROWED);
  const recentActivity = await this.auditLogRepository.findRecentLogs(5);
  // const recentlyAddedBooks = await this.bookRepository.

  // return {
//     total_books,
//     active_users,
//     shelves,
//     books_issued,
//     recent_activity: recent_activity.map((log) => ({
//       createdAt: log.createdAt,
//       action: log.action,
//       entityType: log.entityType,
//       entityId: log.entityId,
//       employee: log.employee
//         ? {
//             id: log.employee.id,
//             employeeID: log.employee.employeeID,
//           }
//         : null,
//     })),
//     recently_added_books: recently_added_books.map((book) => ({
//       id: book.id,
//       isbn: book.isbn,
//       title: book.title,
//       description: book.description,
//       cover_image: book.cover_image,
//       createdAt: book.createdAt,
//       authors: book.authors.map((author) => ({
//         id: author.id,
//         name: author.name,
//       })),
//       genres: book.genres.map((genre) => ({
//         id: genre.id,
//         name: genre.name,
//       })),
//     })),
//   };
};

}


export default AnalyticsService;