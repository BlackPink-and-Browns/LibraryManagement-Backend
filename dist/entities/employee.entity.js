"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmployeeStatus = exports.EmployeeRole = void 0;
const typeorm_1 = require("typeorm");
const abstract_entity_1 = __importDefault(require("./abstract.entity"));
const address_entity_1 = __importDefault(require("./address.entity"));
const department_entity_1 = __importDefault(require("./department.entity"));
var EmployeeRole;
(function (EmployeeRole) {
    EmployeeRole["UI"] = "UI";
    EmployeeRole["UX"] = "UX";
    EmployeeRole["DEVELOPER"] = "DEVELOPER";
    EmployeeRole["HR"] = "HR";
})(EmployeeRole || (exports.EmployeeRole = EmployeeRole = {}));
var EmployeeStatus;
(function (EmployeeStatus) {
    EmployeeStatus["ACTIVE"] = "ACTIVE";
    EmployeeStatus["INACTIVE"] = "INACTIVE";
    EmployeeStatus["PROBATION"] = "PROBATION";
})(EmployeeStatus || (exports.EmployeeStatus = EmployeeStatus = {}));
let Employee = class Employee extends abstract_entity_1.default {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], Employee.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "employeeID", void 0);
__decorate([
    (0, typeorm_1.Column)({ unique: true }),
    __metadata("design:type", String)
], Employee.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employee.prototype, "age", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], Employee.prototype, "experience", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: EmployeeStatus, default: EmployeeStatus.INACTIVE }),
    __metadata("design:type", String)
], Employee.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: "date" }),
    __metadata("design:type", Date)
], Employee.prototype, "joiningDate", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => address_entity_1.default, (address) => address.employee, {
        cascade: true
    }),
    __metadata("design:type", address_entity_1.default)
], Employee.prototype, "address", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => department_entity_1.default, (address) => address.employees),
    __metadata("design:type", department_entity_1.default)
], Employee.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Employee.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum',
        enum: EmployeeRole,
        default: EmployeeRole.DEVELOPER
    }),
    __metadata("design:type", String)
], Employee.prototype, "role", void 0);
Employee = __decorate([
    (0, typeorm_1.Entity)()
], Employee);
exports.default = Employee;
//# sourceMappingURL=employee.entity.js.map