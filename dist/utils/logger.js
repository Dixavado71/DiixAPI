"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
exports.getLogger = getLogger;
exports.createChildLogger = createChildLogger;
const pino_1 = __importDefault(require("pino"));
const logger = (0, pino_1.default)({
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino_1.default.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => ({ level: label }),
    },
    base: {
        service: 'ecms6',
    },
});
exports.logger = logger;
function getLogger() {
    return logger;
}
function createChildLogger(name) {
    return logger.child({ module: name });
}
//# sourceMappingURL=logger.js.map