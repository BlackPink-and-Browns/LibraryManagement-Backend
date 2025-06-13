"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_controller_1 = __importDefault(require("../controllers/auth.controller"));
const auth_service_1 = __importDefault(require("../services/auth.service"));
const express_1 = __importDefault(require("express"));
const employee_route_1 = require("./employee.route");
const authRouter = new express_1.default.Router();
const authService = new auth_service_1.default(employee_route_1.employeeService);
const authController = new auth_controller_1.default(authService, authRouter);
exports.default = authRouter;
//# sourceMappingURL=auth.route.js.map