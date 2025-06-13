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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const constants_1 = require("../utils/constants");
const logger_service_1 = require("./logger.service");
class AuthService {
    constructor(employeeService) {
        this.employeeService = employeeService;
        this.logger = logger_service_1.LoggerService.getInstance(AuthService.name);
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const employee = yield this.employeeService.getEmployeeByEmail(email);
            if (!employee) {
                this.logger.error("No such user");
                throw new http_exception_1.default(404, "No such user");
            }
            const isPasswordValid = yield bcrypt_1.default.compare(password, employee.password);
            if (!isPasswordValid) {
                this.logger.error("Invalid Password");
                throw new http_exception_1.default(400, "Invalid Password");
            }
            const payload = {
                id: employee.id,
                email: employee.email,
                role: employee.role,
            };
            const token = jsonwebtoken_1.default.sign(payload, constants_1.JWT_SECRET, {
                expiresIn: constants_1.JWT_VALIDITY,
            });
            this.logger.info("Login colpleted");
            return {
                tokenType: "Bearer",
                accessToken: token,
                user: employee.id
            };
        });
    }
}
exports.default = AuthService;
//# sourceMappingURL=auth.service.js.map