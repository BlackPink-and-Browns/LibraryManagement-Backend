import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class BookCopyResponseDTO {
    @IsNotEmpty()
    copy_id: number;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    shelf_id: string;

    @IsNotEmpty()
    is_available: boolean;

    @IsNotEmpty()
    created_by: string;
}
