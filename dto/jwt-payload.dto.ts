import { IsInt } from "class-validator";
import { EmployeeRole } from "../entities/enums";

export default class JWTPayLoad {
    @IsInt()
    id:number;

    email:string

    role:EmployeeRole
}