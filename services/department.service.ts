import Department from "../entities/department.entity";
import Employee from "../entities/employee.entity";
import httpException from "../exceptions/http.exception";
import loggerMiddleware from "../loggerMiddleware";
import DepartmentRepository from "../repositories/department.repository";
import { employeeService } from "../routes/employee.route";
import { LoggerService } from "./logger.service";

class DepartmentService {
    private logger = LoggerService.getInstance(DepartmentService.name)
    constructor(private departmentRepository : DepartmentRepository){}

    async createDepartment(name:string) : Promise<Department> {
        const department = new Department()
        department.name = name
        department.employees = []
        this.logger.info("department created")
        return this.departmentRepository.create(department)
    }

    async getAllDepartments() : Promise<Department[]> {
        this.logger.info("departments returned")
        return this.departmentRepository.findAll()
    }

    async getDepartmentByID (id:number) : Promise<Department> {
        const existingDepartment = await this.departmentRepository.findOneByID(id)
        if(!existingDepartment) {
            this.logger.error("department not found")
            throw new httpException(400,"department not found")
        }
        this.logger.info("department returned")
        return this.departmentRepository.findOneByID(id)
    }

    async addEmployeeToDepartmentByID (id:number , employeeid:number) : Promise<void> {
        const department = await this.departmentRepository.findOneByID(id)
        if(!department){
            this.logger.error("department does not exist")
            throw new httpException(400,"Department does not exist")
        }
        const employee = await employeeService.getEmployeeByID(employeeid)
        await employeeService.updateEmployeeDepartment(employeeid,department)
        department.employees.push(employee)
        await this.departmentRepository.update(id,department)
        this.logger.info("employee added to department")

    }

    async removeEmployeeFromDepartmentByID (id:number , employeeid:number) : Promise<void> {
        const department = await this.departmentRepository.findOneByID(id)
        if(!department){
            this.logger.error("department does not exist")
            throw new httpException(400,"Department does not exist")
        }
        const employee = await employeeService.getEmployeeByID(employeeid)
        if(!department.employees.includes(employee)){
            this.logger.error("employee not in department")
            throw new httpException(400,"employee not found in department")
        }
        const i = department.employees.indexOf(employee)
        department.employees.splice(i,1)
        await this.departmentRepository.update(id,department)
        await employeeService.updateEmployeeDepartment(employeeid,null)
        this.logger.info("employee removed from department")

        
    }

    async deleteDepartment (id:number) {
        const department = await this.departmentRepository.findOneByID(id)
        if(!department){
            this.logger.error("department does not exist")
            throw new httpException(400,"Department does not exist")
        }
        await this.departmentRepository.delete(id)
        this.logger.info("department deleted")
    }

    async updateDepartment (id:number , name: string) {
        const existingDepartment = await this.departmentRepository.findOneByID(id)
        if(!existingDepartment){
            this.logger.error("department does not exist")
            throw new httpException(400,"Department does not exist")
        }
        existingDepartment.name = name
        await this.departmentRepository.update(id,existingDepartment)
        this.logger.info("department updated")
    }
}

export default DepartmentService