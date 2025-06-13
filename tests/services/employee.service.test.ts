import { mock, MockProxy } from "jest-mock-extended";
import { when } from "jest-when";
import EmployeeRepository from "../../repositories/employee.repository";
import EmployeeService from "../../services/employee.service";
import Employee from "../../entities/employee.entity";
import Address from "../../entities/address.entity";
import DepartmentRepository from "../../repositories/department.repository";
import { departmentRepository } from "../../routes/department.route";

describe("EmployeeService", () => {
    let employeeRepository: MockProxy<EmployeeRepository>;
    let employeeService: EmployeeService;
    let departmentRepository: MockProxy<DepartmentRepository>;


    beforeEach(() => {
        employeeRepository = mock<EmployeeRepository>();
        employeeService = new EmployeeService(employeeRepository)
    });

    describe("geEmployeeByID", () => {
        it("should return value when user with proper id exists" , async () => {
            //Arrange
            const e = new Employee()
            e.name="name"
            e.id = 123
            e.email="email@gmail.com"
            e.age = 25
            e.password = "password"
            
            when(employeeRepository.findOneByID).calledWith(1).mockReturnValue(e)
            //Act
            const result = await employeeService.getEmployeeByID(1)
            //Assert
            expect(result).toEqual(e)
            expect(employeeRepository.findOneByID).toHaveBeenCalled()
        })

        it("should not return value when user with proper id does not exist" , async () => {
            //Arrange
            when(employeeRepository.findOneByID).calledWith(1).mockReturnValue(null)
            //Act
            expect(employeeService.getEmployeeByID(2)).rejects.toThrow("Employee not found")
            //Assert
            expect(employeeRepository.findOneByID).toHaveBeenCalledWith(2)
        })
    });
});