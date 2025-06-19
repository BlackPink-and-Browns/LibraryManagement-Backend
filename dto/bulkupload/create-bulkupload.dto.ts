import { IsArray, IsNumber, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class BulkUploadError {
  @IsNumber()
  row: number;

  @IsArray()
  @IsString({ each: true })
  errors: string[];
}

export class BulkUploadErrorDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BulkUploadError)
  errors: BulkUploadError[];
}
