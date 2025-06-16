import {
  IsEmail,
  IsInt,
  IsNumber,
  IsString,
  ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { BookPreviewResponseDto } from "../books/book-preview-response.dto";

export class BookCopyResponseDTO {
  @Expose()
  copy_id: number;

  @Expose()
  @ValidateNested()
  @Type(() => BookPreviewResponseDto)
  book: BookPreviewResponseDto;

  @Expose()
  shelf_id: string;

  @Expose()
  is_available: boolean;
}
