"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const constants_1 = require("../utils/constants");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        throw new http_exception_1.default(401, "unauthorized");
    }
    const tokenSplit = token.split(" ");
    if (tokenSplit.length != 2) {
        throw new http_exception_1.default(401, "Invalid Token");
    }
    if (!tokenSplit[1]) {
        throw new http_exception_1.default(401, "unauthorized");
    }
    try {
        const payload = jsonwebtoken_1.default.verify(tokenSplit[1], constants_1.JWT_SECRET);
        req.user = payload;
    }
    catch (_a) {
        throw new http_exception_1.default(401, "Invalid or expired token");
    }
    next();
};
exports.default = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map