import { IsInt } from "class-validator";
import { EmployeeRole } from "../entities/employee.entity";

export default class JWTPayLoad {
    @IsInt()
    id:number;

    email:string

    role:EmployeeRole
}