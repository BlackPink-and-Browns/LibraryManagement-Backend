"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const http_exception_1 = __importDefault(require("../exceptions/http.exception"));
const checkRole = (authorizedRoles) => {
    return (req, res, next) => {
        var _a;
        const userRole = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        let hasAccess = authorizedRoles.includes(userRole);
        if (!hasAccess) {
            throw new http_exception_1.default(403, "User has no permission");
        }
        next();
    };
};
exports.checkRole = checkRole;
//# sourceMappingURL=authorization.middleware.js.map