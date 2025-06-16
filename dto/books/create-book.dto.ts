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
    cover_image: string;

    @IsNotEmpty()
    authors: number[]

    @IsNotEmpty()
    genres:number[]

    @IsNotEmpty()
    description: string;
}
