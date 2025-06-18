import { IsNotEmpty, IsEmail, IsString, isNotEmpty } from "class-validator";
import Department from "../../entities/department.entity";
import { DepartmentPreviewResponseDto } from "./department-preview-response.dto";
import { BorrowRecord } from "../../entities/borrowrecord.entity";
import { Book } from "../../entities/book.entity";
import { BookCopy } from "../../entities/bookcopy.entity";

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
    borrowed_books: BookCopy[]

    @IsNotEmpty()
    current_overdue: number

    @IsNotEmpty()
    overdue_books: BookCopy[]

    @IsNotEmpty()
    book_history: BookCopy[]

    @IsNotEmpty()
    current_waitlist: number

    @IsNotEmpty()
    unread_notifications: number
}
