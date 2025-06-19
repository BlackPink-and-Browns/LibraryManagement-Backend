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

export class CreateBookCopyDTO {
    @IsNotEmpty()
    book_id: number;

    @IsNotEmpty()
    count: number;

    @IsOptional()
    shelf_id: number
}
