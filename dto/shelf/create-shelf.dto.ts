import { IsNotEmpty, IsNumber, IsString, IsUUID } from 'class-validator';

export class CreateShelfDto {
  @IsNumber()
  @IsNotEmpty()
  label_id: number;

  @IsNumber()
  @IsNotEmpty()
  officeId: number;
}
