"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const errorMiddleware = (error, req, res, next) => {
    try {
        if (error instanceof http_exception_1.default) {
            const status = error.status || 500;
            const message = error.message || "something went wrong";
            let respbody = { message: message };
            res.status(status).json(respbody);
        }
        else {
            console.error(error.stack);
            res.status(500).send({ error: error.message });
        }
    }
    catch (error) {
        next(error);
    }
};
exports.default = errorMiddleware;
//# sourceMappingURL=error.middleware.js.map