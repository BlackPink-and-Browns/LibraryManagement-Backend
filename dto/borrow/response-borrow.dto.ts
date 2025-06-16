import { Expose, Type } from 'class-transformer';
import { BookCopy } from '../../entities/bookcopy.entity';
import Employee  from '../../entities/employee.entity';
import { Shelf } from '../../entities/shelf.entity';

export class BorrowRecordResponseDto {
  @Expose()
  id: string;

  @Expose()
  status: string;

  @Expose()
  borrowed_at: Date;

  @Expose()
  returned_at: Date;

  @Expose()
  overdue_alert_sent: boolean;

  @Expose()
  @Type(() => BookCopy)
  bookCopy: BookCopy;

  @Expose()
  @Type(() => Employee)
  borrowedBy: Employee;

  @Expose()
  @Type(() => Shelf)
  returnShelf?: Shelf;
}
