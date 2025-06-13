import { IsDate, IsEmail, IsEnum, IsInt, isNotEmpty, IsNotEmpty, IsNumber, IsString, MinLength, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { CreateAddressDto } from "./create-address.dto";
import { EmployeeRole, EmployeeStatus } from "../entities/employee.entity";
import Department from "../entities/department.entity";

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ValidateNested()
  @Type(()=> CreateAddressDto)
  address: CreateAddressDto

  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  password : string
  
  @IsNotEmpty()
  @IsEnum(EmployeeRole)
  role: EmployeeRole

  @IsNotEmpty()
  @IsEnum(EmployeeStatus)
  status: EmployeeStatus

  @IsNotEmpty()
  @IsInt()
  experience: number

  @IsNotEmpty()
  joiningDate: Date

  @IsNotEmpty()
  @IsString()
  employeeID: string

  @IsNotEmpty()
  @IsNumber()
  department_id: number;
  
}
