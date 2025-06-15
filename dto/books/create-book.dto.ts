import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateBookDTO {

    @IsNotEmpty()
    isbn: string;

    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    author: string

    @IsNotEmpty()
    genres:string

    @IsNotEmpty()
    description: string;

    @IsNotEmpty()
    created_by: string;
}
