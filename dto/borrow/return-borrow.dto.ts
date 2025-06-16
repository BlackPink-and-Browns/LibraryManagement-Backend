import { IsUUID, IsEnum, IsOptional } from 'class-validator';
import { BorrowStatus } from '../../entities/enums';

export class ReturnBorrowDto {
  @IsEnum(BorrowStatus)
  status: BorrowStatus;

  @IsUUID()
  @IsOptional()
  returnShelfId?: string;
}
