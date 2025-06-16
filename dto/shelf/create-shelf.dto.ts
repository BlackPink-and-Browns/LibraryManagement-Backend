import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateShelfDto {
  @IsString()
  @IsNotEmpty()
  label: string;

  @IsUUID()
  @IsNotEmpty()
  officeId: string;
}
