import { IsNumber, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateShelfDto {
  @IsNumber()
  @IsOptional()
  label_id: number;
}
