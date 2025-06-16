import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class AuthorResponseDTO {
    @IsNotEmpty()
    author_id: number

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    books_id: number[]
    
}
