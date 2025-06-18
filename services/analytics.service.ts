import AuditLogRepository from "../repositories/audit.repository";
import BookCopyRepository from "../repositories/book-copies.repository";
import BookRepository from "../repositories/book.repository";
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
    private auditLogRepository: AuditLogRepository
) {}

async getDashboardSummary(){
  
};

}


export default AnalyticsService;