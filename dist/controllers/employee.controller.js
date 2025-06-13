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
const employee_entity_1 = require("../entities/employee.entity");
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const create_employee_dto_1 = require("../dto/create-employee.dto");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
class EmployeeController {
    constructor(employeeService, router) {
        this.employeeService = employeeService;
        this.deleteEmployee = (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.employeeService.deleteEmployeeByID(Number(req.params.id));
            res.status(204).send();
        });
        this.updateEmployee = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const updateEmployeeDto = (0, class_transformer_1.plainToInstance)(create_employee_dto_1.CreateEmployeeDto, req.body);
                const errors = yield (0, class_validator_1.validate)(updateEmployeeDto);
                if (errors.length > 0) {
                    console.log(JSON.stringify(errors));
                    throw new http_exception_1.default(404, JSON.stringify(errors));
                }
                const id = Number(req.params.id);
                yield this.employeeService.updateEmployee(id, updateEmployeeDto.name, updateEmployeeDto.email, updateEmployeeDto.age, updateEmployeeDto.address, updateEmployeeDto.password, updateEmployeeDto.role, updateEmployeeDto.employeeID, updateEmployeeDto.experience, updateEmployeeDto.joiningDate, updateEmployeeDto.status, updateEmployeeDto.department_id);
                res.status(200).send();
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
        router.post("/", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR, employee_entity_1.EmployeeRole.UI]), this.createEmployee.bind(this));
        router.get("/", this.getAllEmployees.bind(this));
        router.get("/:id", this.getEmployeeByID.bind(this));
        router.delete("/:id", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR]), this.deleteEmployee);
        router.put("/:id", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR, employee_entity_1.EmployeeRole.UI]), this.updateEmployee);
    }
    getAllEmployees(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const e = yield this.employeeService.getAllEmployees();
            res.status(200).send(e);
        });
    }
    getEmployeeByID(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const e = yield this.employeeService.getEmployeeByID(Number(req.params.id));
                if (!e) {
                    throw new http_exception_1.default(404, "employee not found");
                }
                res.status(200).send(e);
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
    createEmployee(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createEmployeeDto = (0, class_transformer_1.plainToInstance)(create_employee_dto_1.CreateEmployeeDto, req.body);
                const errors = yield (0, class_validator_1.validate)(createEmployeeDto);
                if (errors.length > 0) {
                    console.log(JSON.stringify(errors));
                    throw new http_exception_1.default(400, JSON.stringify(errors));
                }
                const e = yield this.employeeService.createEmployee(createEmployeeDto.name, createEmployeeDto.email, createEmployeeDto.age, createEmployeeDto.address, createEmployeeDto.password, createEmployeeDto.role, createEmployeeDto.employeeID, createEmployeeDto.experience, createEmployeeDto.joiningDate, createEmployeeDto.status, createEmployeeDto.department_id);
                res.status(201).send(e);
            }
            catch (err) {
                console.log(err);
                next(err);
            }
        });
    }
}
exports.default = EmployeeController;
//# sourceMappingURL=employee.controller.js.map