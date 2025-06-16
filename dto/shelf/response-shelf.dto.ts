import { Expose, Type } from "class-transformer";
import { BookCopyResponseDTO } from "../book-copies/book-copy-response.dto";
import { ValidateNested } from "class-validator";

export class OfficeResponseDTO {
  id: number;
  name: string;
  address: string;
}

export class ShelfResponseDto {
  @Expose()
  id: string;

  @Expose()
  label: string;

  @Expose()
  @Type(() => BookCopyResponseDTO)
  bookCopies: BookCopyResponseDTO[];

  @ValidateNested()
  @Type(() => OfficeResponseDTO)
  office: OfficeResponseDTO;
}
