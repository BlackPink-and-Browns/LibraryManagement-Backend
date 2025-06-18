import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsOptional,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateBookDTO {

    @IsOptional()
    isbn: string;

    @IsOptional()
    title: string;
    @IsOptional()
    cover_image: string;
    @IsOptional()
    authors: number[];
    @IsOptional()
    genres: number[];
    @IsOptional()
    description: string;
}
