import { Request, Response, Router, NextFunction } from "express";
import Employee, { EmployeeRole } from "../entities/employee.entity";
import EmployeeService from "../services/employee.service";
import httpException from "../exceptions/http.exception";
import { isEmail } from "../validators/email.validator";
import { CreateEmployeeDto } from "../dto/create-employee.dto";
import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import {checkRole } from "../middlewares/authorization.middleware";

class EmployeeController {
    constructor(private employeeService: EmployeeService, router: Router) {
        router.post("/",checkRole([EmployeeRole.HR,EmployeeRole.UI]), this.createEmployee.bind(this));
        router.get("/", this.getAllEmployees.bind(this));
        router.get("/:id", this.getEmployeeByID.bind(this));
        router.delete("/:id",checkRole([EmployeeRole.HR]), this.deleteEmployee);
        router.put("/:id",checkRole([EmployeeRole.HR,EmployeeRole.UI]), this.updateEmployee);
    }

    async getAllEmployees(req: Request, res: Response) {
        const e: Employee[] = await this.employeeService.getAllEmployees();
        res.status(200).send(e);
    }

    async getEmployeeByID(req: Request, res: Response, next: NextFunction) {
        try {
            const e = await this.employeeService.getEmployeeByID(
                Number(req.params.id)
            );
            if (!e) {
                throw new httpException(404, "employee not found");
            }
            res.status(200).send(e);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    async createEmployee(req: Request, res: Response, next: NextFunction) {
        try {
            const createEmployeeDto = plainToInstance(
                CreateEmployeeDto,
                req.body
            );
            const errors = await validate(createEmployeeDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(400, JSON.stringify(errors));
            }

            const e = await this.employeeService.createEmployee(
                createEmployeeDto.name,
                createEmployeeDto.email,
                createEmployeeDto.age,
                createEmployeeDto.address,
                createEmployeeDto.password,
                createEmployeeDto.role,
                createEmployeeDto.employeeID,
                createEmployeeDto.experience,
                createEmployeeDto.joiningDate,
                createEmployeeDto.status,
                createEmployeeDto.department_id
            );

            res.status(201).send(e);
        } catch (err) {
            console.log(err);
            next(err);
        }
    }

    deleteEmployee = async (req: Request, res: Response) => {
        await this.employeeService.deleteEmployeeByID(Number(req.params.id));

        res.status(204).send();
    };

    updateEmployee = async (req: Request,res: Response,next: NextFunction) => {
        try {
            const updateEmployeeDto = plainToInstance(
                CreateEmployeeDto,
                req.body
            );
            const errors = await validate(updateEmployeeDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(404, JSON.stringify(errors));
            }
            const id = Number(req.params.id);
            await this.employeeService.updateEmployee(
                id,
                updateEmployeeDto.name,
                updateEmployeeDto.email,
                updateEmployeeDto.age,
                updateEmployeeDto.address,
                updateEmployeeDto.password,
                updateEmployeeDto.role,
                updateEmployeeDto.employeeID,
                updateEmployeeDto.experience,
                updateEmployeeDto.joiningDate,
                updateEmployeeDto.status,
                updateEmployeeDto.department_id
            );

            res.status(200).send();
        } catch (err) {
            console.log(err);
            next(err);
        }
    };
}

export default EmployeeController;
