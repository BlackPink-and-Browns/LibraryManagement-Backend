import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Expose, Type } from "class-transformer";
import { GenrePreviewResponseDto } from "../genres/genre-preview-response.dto";
import { AuthorPreviewResponseDto } from "../authors/author-preview-response.dto";

export class BookResponseDTO {
    @Expose()
    book_id: number;

    @Expose()
    isbn: string;

    @Expose()
    title: string;

    @Expose()
    @ValidateNested()
    @Type(() => AuthorPreviewResponseDto)
    author: AuthorPreviewResponseDto;

    @Expose()
    @ValidateNested()
    @Type(() => GenrePreviewResponseDto)
    genres: GenrePreviewResponseDto[];

    @Expose()
    description: string;

    @Expose()
    created_by: string;
}
