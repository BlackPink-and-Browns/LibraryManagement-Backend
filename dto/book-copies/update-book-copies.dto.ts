import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class updateBookCopyDTO {
    @IsNotEmpty()
    book_id: number;

    @IsNotEmpty()
    shelf_id: string;

    @IsNotEmpty()
    updated_by: string;
}
