"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = void 0;
exports.getLogger = getLogger;
exports.createChildLogger = createChildLogger;
const pino_1 = __importDefault(require("pino"));
let logger;
function getLogger() {
    if (!logger) {
        const logLevel = process.env.LOG_LEVEL || 'info';
        exports.default = logger = (0, pino_1.default)({
            level: logLevel,
            timestamp: pino_1.default.stdTimeFunctions.isoTime,
            formatters: {
                level: (label) => ({ level: label }),
            },
            base: {
                service: 'ecms6',
            },
        });
    }
    return logger;
}
function createChildLogger(name) {
    return getLogger().child({ module: name });
}
// Initialize logger on module load
exports.default = logger = getLogger();
//# sourceMappingURL=logger.js.map