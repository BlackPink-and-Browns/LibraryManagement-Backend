"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const loggerMiddleware = (req, res, next) => {
    res.on("finish", () => {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode}`);
    });
    // Call next middleware, or handler
    next();
};
exports.default = loggerMiddleware;
//# sourceMappingURL=loggerMiddleware.js.map