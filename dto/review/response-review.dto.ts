import { Expose, Type } from 'class-transformer';
import { Book } from '../../entities/book.entity';
import Employee from '../../entities/employee.entity';
import { BookPreviewResponseDto } from '../books/book-preview-response.dto';
import { EmployeePreviewResponseDto } from '../employee/employee-preview-response.dto';

export class ReviewResponseDto {

  @Expose()
  id: number;

  @Expose()
  rating: number;

  @Expose()
  content: string;

  @Expose()
  @Type(() => BookPreviewResponseDto)
  book?: BookPreviewResponseDto;

  @Expose()
  @Type(() => EmployeePreviewResponseDto)
  employee?: EmployeePreviewResponseDto;
}
