"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class httpException extends Error {
    constructor(status, message) {
        super(message);
        this.status = status;
        this.message = message;
    }
}
exports.default = httpException;
//# sourceMappingURL=http.exception.js.map