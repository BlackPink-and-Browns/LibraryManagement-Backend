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
const class_transformer_1 = require("class-transformer");
const create_department_dto_1 = require("../dto/create-department.dto");
const employee_entity_1 = require("../entities/employee.entity");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
const class_validator_1 = require("class-validator");
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
class DepartmentController {
    constructor(departmentService, router) {
        this.departmentService = departmentService;
        router.get("/", this.getAllDepartments.bind(this));
        router.get("/:id", this.getDepartmentByID.bind(this));
        router.post("/", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR]), this.createDepartment.bind(this));
        router.post("/:id", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR]), this.addEmployee.bind(this));
        router.delete("/:id", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR]), this.deleteDepartment.bind(this));
        router.delete("/remove/:id", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR]), this.removeEmployee.bind(this));
        router.put("/:id", (0, authorization_middleware_1.checkRole)([employee_entity_1.EmployeeRole.HR]), this.updateDepartment.bind(this));
    }
    getAllDepartments(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const departments = yield this.departmentService.getAllDepartments();
            res.status(200).send(departments);
        });
    }
    getDepartmentByID(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const department = yield this.departmentService.getDepartmentByID(Number(req.params.id));
                if (!department) {
                    throw new http_exception_1.default(400, "department not found");
                }
                res.status(200).send(department);
            }
            catch (err) {
                next(err);
            }
        });
    }
    createDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createDepartmentDto = (0, class_transformer_1.plainToInstance)(create_department_dto_1.CreateDepartmentDto, req.body);
                const errors = yield (0, class_validator_1.validate)(createDepartmentDto);
                if (errors.length > 0) {
                    console.log(JSON.stringify(errors));
                    throw new http_exception_1.default(400, JSON.stringify(errors));
                }
                const dep = yield this.departmentService.createDepartment(createDepartmentDto.name);
                res.status(204).send(dep);
            }
            catch (err) {
                next(err);
            }
        });
    }
    addEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.departmentService.removeEmployeeFromDepartmentByID(Number(req.params.id), req.body.employeeid);
            yield this.departmentService.addEmployeeToDepartmentByID(Number(req.params.id), req.body.employeeid);
            res.status(200).send("added");
        });
    }
    deleteDepartment(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.departmentService.deleteDepartment(req.params.id);
            res.status(201).send("deleted");
        });
    }
    updateDepartment(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const createDepartmentDto = (0, class_transformer_1.plainToInstance)(create_department_dto_1.CreateDepartmentDto, req.body);
                const errors = yield (0, class_validator_1.validate)(createDepartmentDto);
                if (errors.length > 0) {
                    console.log(JSON.stringify(errors));
                    throw new http_exception_1.default(400, JSON.stringify(errors));
                }
                yield this.departmentService.updateDepartment(req.params.id, createDepartmentDto.name);
                res.status(200).send("updated");
            }
            catch (err) {
                next(err);
            }
        });
    }
    removeEmployee(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.departmentService.removeEmployeeFromDepartmentByID(Number(req.params.id), req.body.employeeid);
            res.status(200).send("removed");
        });
    }
}
exports.default = DepartmentController;
//# sourceMappingURL=department.controller.js.map