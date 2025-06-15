import { IsInt } from "class-validator";
import { EmployeeRole } from "../types/enums";

export default class JWTPayLoad {
    @IsInt()
    id:number;

    email:string

    role:EmployeeRole
}