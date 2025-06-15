import {
    IsEmail,
    IsInt,
    isNotEmpty,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class GenreResponseDTO {
    @IsNotEmpty()
    genre_id:number

    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}
