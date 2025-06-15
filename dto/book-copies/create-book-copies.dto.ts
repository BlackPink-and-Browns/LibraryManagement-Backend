import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateBookCopyDTO {
    @IsNotEmpty()
    book_id: number;

    @IsNotEmpty()
    shelf_id: string;

    @IsNotEmpty()
    created_by: string;
}
