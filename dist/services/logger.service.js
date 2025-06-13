"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoggerService = void 0;
const winston_1 = require("winston");
class LoggerService {
    constructor(context) {
        this.winstonLogger = LoggerService.createWinstonLogger();
        this.context = context;
    }
    /**
     * Create the instance of the logger to be used across the application code.
     * @param {string} context The context of this logger instance to be printed.
     * @returns {LoggerService} The instance of the logger.
     */
    static getInstance(context) {
        LoggerService.instance = new LoggerService(context);
        return LoggerService.instance;
    }
    static createWinstonLogger() {
        const logFormat = winston_1.format.printf((info) => `${info.level}: [${info.timestamp}]${info.message}`);
        const transportList = [
            new winston_1.transports.Console({
                format: winston_1.format.combine(winston_1.format.timestamp(), winston_1.format.colorize(), logFormat),
            }),
        ];
        return (0, winston_1.createLogger)({
            transports: transportList,
            exitOnError: false,
        });
    }
    createLog(level, message) {
        const moduleName = this.context;
        const messageString = typeof message === 'object' && message
            ? JSON.stringify(message, null, 2)
            : message;
        this.winstonLogger.log(level, `[${moduleName}] ${messageString}`);
    }
    /**
     * * Methods for logging using the LoggerService instance.
     * Following methods are available:
     * debug, info, error, warn
     *
     * @param message The additional message that needs to be logged.
     */
    debug(message) {
        this.createLog('debug', message);
    }
    info(message) {
        this.createLog('info', message);
    }
    error(message) {
        this.createLog('error', message);
    }
    warn(message) {
        this.createLog('warn', message);
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger.service.js.map