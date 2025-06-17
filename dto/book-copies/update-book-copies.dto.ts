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
    copy_id: number;

    shelf_id: number;

    is_available: boolean
}
