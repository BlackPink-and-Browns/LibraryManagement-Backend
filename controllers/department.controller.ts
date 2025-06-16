import { plainToInstance } from "class-transformer";
import { CreateDepartmentDto } from "../dto/employee/create-department.dto";
import Department from "../entities/department.entity";
import Employee from "../entities/employee.entity";
import { EmployeeRole } from "../entities/enums";
import { checkRole } from "../middlewares/authorization.middleware";
import DepartmentService from "../services/department.service";
import { Router } from "express";
import { validate } from "class-validator";
import httpException from "../exceptions/http.exception";
import { Request, Response, NextFunction } from "express";

class DepartmentController {
    constructor(private departmentService: DepartmentService, router: Router) {
        router.get("/", this.getAllDepartments.bind(this));
        router.get("/:id", this.getDepartmentByID.bind(this));
        router.post(
            "/",
            checkRole([EmployeeRole.HR]),
            this.createDepartment.bind(this)
        );
        router.post(
            "/:id",
            checkRole([EmployeeRole.HR]),
            this.addEmployee.bind(this)
        );
        router.delete(
            "/:id",
            checkRole([EmployeeRole.HR]),
            this.deleteDepartment.bind(this)
        );
        router.delete(
            "/remove/:id",
            checkRole([EmployeeRole.HR]),
            this.removeEmployee.bind(this)
        );
        router.put(
            "/:id",
            checkRole([EmployeeRole.HR]),
            this.updateDepartment.bind(this)
        );
    }

    async getAllDepartments(req: Request, res: Response) {
        const departments: Department[] =
            await this.departmentService.getAllDepartments();
        res.status(200).send(departments);
    }

    async getDepartmentByID(req: Request, res: Response, next: NextFunction) {
        try {
            const department = await this.departmentService.getDepartmentByID(
                Number(req.params.id)
            );
            if (!department) {
                throw new httpException(400, "department not found");
            }
            res.status(200).send(department);
        } catch (err) {
            next(err);
        }
    }

    async createDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            const createDepartmentDto = plainToInstance(
                CreateDepartmentDto,
                req.body
            );
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(400, JSON.stringify(errors));
            }
            const dep = await this.departmentService.createDepartment(
                createDepartmentDto.name,
                req.user?.id
            );
            res.status(204).send(dep);
        } catch (err) {
            next(err);
        }
    }
    async addEmployee(req: Request, res: Response) {
        await this.departmentService.removeEmployeeFromDepartmentByID(
            Number(req.params.id),
            req.body.employeeid
        );
        await this.departmentService.addEmployeeToDepartmentByID(
            Number(req.params.id),
            req.body.employeeid
        );
        res.status(200).send("added");
    }

    async deleteDepartment(req: Request, res: Response) {
        await this.departmentService.deleteDepartment(req.params.id,req.user?.id);
        res.status(201).send("deleted");
    }

    async updateDepartment(req: Request, res: Response, next: NextFunction) {
        try {
            const createDepartmentDto = plainToInstance(
                CreateDepartmentDto,
                req.body
            );
            const errors = await validate(createDepartmentDto);
            if (errors.length > 0) {
                console.log(JSON.stringify(errors));
                throw new httpException(400, JSON.stringify(errors));
            }
            await this.departmentService.updateDepartment(
                req.params.id,
                createDepartmentDto.name,
                req.user?.id
            );
            res.status(200).send("updated");
        } catch (err) {
            next(err);
        }
    }

    async removeEmployee(req: Request, res: Response) {
        await this.departmentService.removeEmployeeFromDepartmentByID(
            Number(req.params.id),
            req.body.employeeid
        );
        res.status(200).send("removed");
    }
}

export default DepartmentController;
