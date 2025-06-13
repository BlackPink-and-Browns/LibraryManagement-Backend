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
const department_entity_1 = __importDefault(require("../entities/department.entity"));
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const employee_route_1 = require("../routes/employee.route");
const logger_service_1 = require("./logger.service");
class DepartmentService {
    constructor(departmentRepository) {
        this.departmentRepository = departmentRepository;
        this.logger = logger_service_1.LoggerService.getInstance(DepartmentService.name);
    }
    createDepartment(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = new department_entity_1.default();
            department.name = name;
            department.employees = [];
            this.logger.info("department created");
            return this.departmentRepository.create(department);
        });
    }
    getAllDepartments() {
        return __awaiter(this, void 0, void 0, function* () {
            this.logger.info("departments returned");
            return this.departmentRepository.findAll();
        });
    }
    getDepartmentByID(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingDepartment = yield this.departmentRepository.findOneByID(id);
            if (!existingDepartment) {
                this.logger.error("department not found");
                throw new http_exception_1.default(400, "department not found");
            }
            this.logger.info("department returned");
            return this.departmentRepository.findOneByID(id);
        });
    }
    addEmployeeToDepartmentByID(id, employeeid) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.departmentRepository.findOneByID(id);
            if (!department) {
                this.logger.error("department does not exist");
                throw new http_exception_1.default(400, "Department does not exist");
            }
            const employee = yield employee_route_1.employeeService.getEmployeeByID(employeeid);
            yield employee_route_1.employeeService.updateEmployeeDepartment(employeeid, department);
            department.employees.push(employee);
            yield this.departmentRepository.update(id, department);
            this.logger.info("employee added to department");
        });
    }
    removeEmployeeFromDepartmentByID(id, employeeid) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.departmentRepository.findOneByID(id);
            if (!department) {
                this.logger.error("department does not exist");
                throw new http_exception_1.default(400, "Department does not exist");
            }
            const employee = yield employee_route_1.employeeService.getEmployeeByID(employeeid);
            if (!department.employees.includes(employee)) {
                this.logger.error("employee not in department");
                throw new http_exception_1.default(400, "employee not found in department");
            }
            const i = department.employees.indexOf(employee);
            department.employees.splice(i, 1);
            yield this.departmentRepository.update(id, department);
            yield employee_route_1.employeeService.updateEmployeeDepartment(employeeid, null);
            this.logger.info("employee removed from department");
        });
    }
    deleteDepartment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const department = yield this.departmentRepository.findOneByID(id);
            if (!department) {
                this.logger.error("department does not exist");
                throw new http_exception_1.default(400, "Department does not exist");
            }
            yield this.departmentRepository.delete(id);
            this.logger.info("department deleted");
        });
    }
    updateDepartment(id, name) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingDepartment = yield this.departmentRepository.findOneByID(id);
            if (!existingDepartment) {
                this.logger.error("department does not exist");
                throw new http_exception_1.default(400, "Department does not exist");
            }
            existingDepartment.name = name;
            yield this.departmentRepository.update(id, existingDepartment);
            this.logger.info("department updated");
        });
    }
}
exports.default = DepartmentService;
//# sourceMappingURL=department.service.js.map