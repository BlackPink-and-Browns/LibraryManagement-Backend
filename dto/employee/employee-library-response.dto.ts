import { IsNotEmpty, IsEmail, IsString, isNotEmpty } from "class-validator";
import Department from "../../entities/department.entity";
import { DepartmentPreviewResponseDto } from "./department-preview-response.dto";

export class EmployeeLibraryResponseDto {
    @IsNotEmpty()
    id: number

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    department: DepartmentPreviewResponseDto

    @IsNotEmpty()
    total_borrowed: number

    @IsNotEmpty()
    current_borrowed: number

    @IsNotEmpty()
    current_overdue: number

    @IsNotEmpty()
    unread_notifications: number
}
