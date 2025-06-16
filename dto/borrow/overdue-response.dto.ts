import { Expose, Type } from 'class-transformer';
import { BorrowStatus } from '../../entities/enums';

export class OverdueAlertDto {
  @Expose()
  id: number;

  @Expose()
  borrowed_at: Date;

  @Expose()
  status: BorrowStatus;

  @Expose()
  @Type(() => OverdueEmployeeDto)
  borrowedBy: OverdueEmployeeDto;

  @Expose()
  @Type(() => OverdueBookDto)
  bookCopy: OverdueBookDto;
}

export class OverdueEmployeeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class OverdueBookDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => BookInfoDto)
  book: BookInfoDto;
}

export class BookInfoDto {
  @Expose()
  title: string;

  @Expose()
  isbn: string;
}
