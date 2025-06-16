import { IsUUID, IsNotEmpty } from 'class-validator';

export class CreateBorrowDto {
  @IsUUID()
  @IsNotEmpty()
  bookCopyId: string;

  @IsUUID()
  @IsNotEmpty()
  employeeId: string;
}
