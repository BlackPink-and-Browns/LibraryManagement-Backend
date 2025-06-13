"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const employee_entity_1 = __importDefault(require("../entities/employee.entity"));
const address_entity_1 = __importDefault(require("../entities/address.entity"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const logger_service_1 = require("./logger.service");
const department_route_1 = require("../routes/department.route");
class EmployeeService {
    constructor(employeeRepository) {
        this.employeeRepository = employeeRepository;
        this.logger = logger_service_1.LoggerService.getInstance(EmployeeService.name);
    }
    getEmployeeByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = this.employeeRepository.findOneByEmail(email);
            if (!employee) {
                this.logger.error("employee not found");
                throw new http_exception_1.default(400, "Employee not found");
            }
            this.logger.info("employee returned");
            return this.employeeRepository.findOneByEmail(email);
        });
    }
    getAllEmployees() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info("employee array returned");
            return this.employeeRepository.findAll();
        });
    }
    getEmployeeByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeRepository.findOneByID(id);
            if (!employee) {
                this.logger.error("employee not found");
                throw new http_exception_1.default(400, "Employee not found");
            }
            this.logger.info("employee returned");
            return employee;
        });
    }
    createEmployee(name, email, age, address, password, role, employeeID, experience, joiningDate, status, department_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const newAddress = new address_entity_1.default();
            newAddress.houseNo = address.houseNo;
            newAddress.line2 = address.line2;
            newAddress.line1 = address.line1;
            newAddress.pincode = address.pincode;
            const e = new employee_entity_1.default();
            e.name = name;
            e.email = email;
            e.age = age;
            e.address = newAddress;
            e.password = yield bcrypt_1.default.hash(password, 10);
            e.role = role;
            e.employeeID = employeeID;
            e.experience = experience;
            e.joiningDate = joiningDate;
            e.status = status;
            const dep = yield department_route_1.departmentRepository.findOneByID(department_id);
            if (!dep) {
                this.logger.error("department not found");
                throw new http_exception_1.default(400, "Department not found");
            }
            e.department = dep;
            this.logger.info("employee created");
            return this.employeeRepository.create(e);
        });
    }
    deleteEmployeeByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            //await this.employeeRepository.delete(id)
            const e = yield this.employeeRepository.findOneByID(id);
            if (!e) {
                this.logger.error("employee not found");
                throw new http_exception_1.default(400, "Employee not found");
            }
            yield this.employeeRepository.remove(e);
        });
    }
    updateEmployee(id, name, email, age, address, password, role, employeeID, experience, joiningDate, status, department_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEmployee = yield this.employeeRepository.findOneByID(id);
            if (!existingEmployee) {
                this.logger.error("employee not found");
                throw new http_exception_1.default(400, "Employee not found");
            }
            existingEmployee.name = name;
            existingEmployee.email = email;
            existingEmployee.age = age;
            existingEmployee.address.houseNo = address.houseNo;
            existingEmployee.address.line1 = address.line1;
            existingEmployee.address.line2 = address.line2;
            existingEmployee.address.pincode = address.pincode;
            existingEmployee.password = yield bcrypt_1.default.hash(password, 10);
            existingEmployee.role = role;
            existingEmployee.employeeID = employeeID;
            existingEmployee.experience = experience;
            existingEmployee.joiningDate = joiningDate;
            existingEmployee.status = status;
            const dep = yield department_route_1.departmentRepository.findOneByID(department_id);
            if (!dep) {
                this.logger.error("department not found");
                throw new http_exception_1.default(400, "Department not found");
            }
            existingEmployee.department = dep;
            yield this.employeeRepository.update(id, existingEmployee);
            this.logger.info("employee updated");
        });
    }
    updateEmployeeDepartment(id, department) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingEmployee = yield this.employeeRepository.findOneByID(id);
            if (!existingEmployee) {
                this.logger.error("employee not found");
                throw new http_exception_1.default(400, "Employee not found");
            }
            existingEmployee.department = department;
            yield this.employeeRepository.update(id, existingEmployee);
        });
    }
}
exports.default = EmployeeService;
//# sourceMappingURL=employee.service.js.map