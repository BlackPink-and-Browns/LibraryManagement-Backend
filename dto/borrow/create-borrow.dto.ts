import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateBorrowDto {
  @IsNotEmpty()
  bookCopyId: number;

  @IsNotEmpty()
  employeeId: number;
}
