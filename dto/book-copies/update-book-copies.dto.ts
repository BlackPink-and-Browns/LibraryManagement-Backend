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

export class UpdateBookCopyDTO {
    @IsOptional()
    shelf_id: number;

    @IsOptional()
    is_available: boolean
}
