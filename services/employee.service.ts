import { InsertResult } from "typeorm";
import  {
    EmployeeRole,
    EmployeeStatus,
} from "../entities/enums";
import Employee from "../entities/employee.entity";
import EmployeeRepository from "../repositories/employee.repository";
import Address from "../entities/address.entity";
import { CreateAddressDto } from "../dto/create-address.dto";
import bcrypt from "bcrypt";
import httpException from "../exceptions/http.exception";
import { LoggerService } from "./logger.service";
import Department from "../entities/department.entity";
import { departmentRepository } from "../routes/department.route";

class EmployeeService {
    private logger = LoggerService.getInstance(EmployeeService.name);

    constructor(private employeeRepository: EmployeeRepository) {}

    async getEmployeeByEmail(email: string): Promise<Employee | null> {
        const employee = this.employeeRepository.findOneByEmail(email);
        if (!employee) {
            this.logger.error("employee not found");
            throw new httpException(400, "Employee not found");
        }
        this.logger.info("employee returned");
        return this.employeeRepository.findOneByEmail(email);
    }

    async getAllEmployees(): Promise<Employee[]> {
        this.logger.info("employee array returned");
        return this.employeeRepository.findAll();
    }

    async getEmployeeByID(id: number): Promise<Employee> {
        const employee = await this.employeeRepository.findOneByID(id);
        if (!employee) {
            this.logger.error("employee not found");
            throw new httpException(400, "Employee not found");
        }
        this.logger.info("employee returned");
        return employee;
    }

    async createEmployee(
        name: string,
        email: string,
        age: number,
        address: CreateAddressDto,
        password: string,
        role: EmployeeRole,
        employeeID: string,
        experience: number,
        joiningDate: Date,
        status: EmployeeStatus,
        department_id: number
    ): Promise<Employee> {
        const newAddress = new Address();
        newAddress.houseNo = address.houseNo;
        newAddress.line2 = address.line2;
        newAddress.line1 = address.line1;
        newAddress.pincode = address.pincode;

        const e = new Employee();
        e.name = name;
        e.email = email;
        e.age = age;
        e.address = newAddress;
        e.password = await bcrypt.hash(password, 10);
        e.role = role;
        e.employeeID = employeeID;
        e.experience = experience;
        e.joiningDate = joiningDate;
        e.status = status;
        const dep = await departmentRepository.findOneByID(department_id);
        if (!dep) {
            this.logger.error("department not found");
            throw new httpException(400, "Department not found");
        }
        e.department = dep;
        this.logger.info("employee created");
        return this.employeeRepository.create(e);
    }

    async deleteEmployeeByID(id: number): Promise<void> {
        //await this.employeeRepository.delete(id)
        const e = await this.employeeRepository.findOneByID(id);
        if (!e) {
            this.logger.error("employee not found");
            throw new httpException(400, "Employee not found");
        }
        await this.employeeRepository.remove(e);
    }

    async updateEmployee(
        id: number,
        name: string,
        email: string,
        age: number,
        address : CreateAddressDto,
        password: string,
        role: EmployeeRole,
        employeeID: string,
        experience: number,
        joiningDate: Date,
        status: EmployeeStatus,
        department_id: number
    ): Promise<void> {
        const existingEmployee = await this.employeeRepository.findOneByID(id);
        if (!existingEmployee) {
            this.logger.error("employee not found");
            throw new httpException(400, "Employee not found");
        }

        existingEmployee.name = name;
        existingEmployee.email = email;
        existingEmployee.age = age;
        existingEmployee.address.houseNo = address.houseNo;
        existingEmployee.address.line1 = address.line1
        existingEmployee.address.line2 = address.line2
        existingEmployee.address.pincode = address.pincode
        existingEmployee.password = await bcrypt.hash(password, 10);
        existingEmployee.role = role;
        existingEmployee.employeeID = employeeID;
        existingEmployee.experience = experience;
        existingEmployee.joiningDate = joiningDate;
        existingEmployee.status = status;
        const dep = await departmentRepository.findOneByID(department_id);
        if (!dep) {
            this.logger.error("department not found");
            throw new httpException(400, "Department not found");
        }
        existingEmployee.department = dep;
        await this.employeeRepository.update(id, existingEmployee);
        this.logger.info("employee updated")
    }

    async updateEmployeeDepartment(id: number, department: Department) {
        const existingEmployee = await this.employeeRepository.findOneByID(id);
        if (!existingEmployee) {
            this.logger.error("employee not found");
            throw new httpException(400, "Employee not found");
        }
        existingEmployee.department = department;
        await this.employeeRepository.update(id, existingEmployee);
    }
}

export default EmployeeService;
