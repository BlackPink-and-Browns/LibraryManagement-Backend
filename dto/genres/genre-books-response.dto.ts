import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { BookPreviewResponseDto } from "../books/book-preview-response.dto";

export class GenreBooksResponseDTO {
    @Expose()
    @ValidateNested()
    @Type(()=> BookPreviewResponseDto)
    books: BookPreviewResponseDto[]
}
