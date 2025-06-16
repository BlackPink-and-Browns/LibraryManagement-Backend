import { IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateShelfDto {
  @IsString()
  @IsOptional()
  label?: string;

  @IsUUID()
  @IsOptional()
  officeId?: string;
}
