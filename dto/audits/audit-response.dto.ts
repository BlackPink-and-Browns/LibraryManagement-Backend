import {
    IsEmail,
    IsInt,
    IsNotEmpty,
    IsNumber,
    IsString,
    ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";
import { Timestamp } from "typeorm";

export class AuditResponseDTO {
    @IsNotEmpty()
    employee_id: string;

    @IsNotEmpty()
    action: string

    @IsNotEmpty()
    entity_type: string

    @IsNotEmpty()
    entity_id: number

    @IsNotEmpty()
    timestamp: Timestamp;
}
