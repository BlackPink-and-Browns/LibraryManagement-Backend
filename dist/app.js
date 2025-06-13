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
const express_1 = __importDefault(require("express"));
const employee_route_1 = __importDefault(require("./routes/employee.route"));
const loggerMiddleware_1 = __importDefault(require("./loggerMiddleware"));
const data_source_1 = __importDefault(require("./db/data-source"));
const processTimeMiddleware_1 = __importDefault(require("./processTimeMiddleware"));
const error_middleware_1 = __importDefault(require("./middlewares/error.middleware"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const auth_middleware_1 = __importDefault(require("./middlewares/auth.middleware"));
const logger_service_1 = require("./services/logger.service");
const department_route_1 = __importDefault(require("./routes/department.route"));
const cors_1 = __importDefault(require("cors"));
const server = (0, express_1.default)();
const logger = logger_service_1.LoggerService.getInstance("app()");
server.use(express_1.default.json());
server.use(loggerMiddleware_1.default);
server.use(processTimeMiddleware_1.default);
server.use((0, cors_1.default)());
server.use("/employees", auth_middleware_1.default, employee_route_1.default);
server.use("/department", auth_middleware_1.default, department_route_1.default);
server.use("/auth", auth_route_1.default);
server.use(error_middleware_1.default);
server.get("/", (req, res) => {
    res.status(200).send("hi");
});
const init = () => __awaiter(void 0, void 0, void 0, function* () {
    console.log("starting app.ts");
    try {
        yield data_source_1.default.initialize();
        logger.info("connected to database training");
        server.listen(3000, () => {
            logger.info("server listening to 3000");
        });
    }
    catch (_a) {
        logger.error("Failed to connect");
        process.exit(1);
    }
});
init();
//# sourceMappingURL=app.js.map