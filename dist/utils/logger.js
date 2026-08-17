import pino from 'pino';
const logger = pino({
    level: process.env.LOG_LEVEL || 'info',
    timestamp: pino.stdTimeFunctions.isoTime,
    formatters: {
        level: (label) => ({ level: label }),
    },
    base: {
        service: 'ecms6',
    },
});
export function getLogger() {
    return logger;
}
export function createChildLogger(name) {
    return logger.child({ module: name });
}
export { logger };
//# sourceMappingURL=logger.js.map