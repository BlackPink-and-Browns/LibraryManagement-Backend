import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class UpdateBookDTO {

    isbn: string;

    title: string;

    author: string

    genres:string

    description: string;
}
