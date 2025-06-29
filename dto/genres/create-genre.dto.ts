import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateGenreDTO {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    description: string;
}
