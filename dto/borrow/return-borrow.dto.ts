import { IsNotEmpty, isNotEmpty, IsNumber } from "class-validator";

export class ReturnBorrowDto{
    @IsNotEmpty()
    @IsNumber()
    returned_shelf_no:number;
}