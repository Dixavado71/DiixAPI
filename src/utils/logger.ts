import pino, { Logger } from 'pino';

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

export function getLogger(): Logger {
  return logger;
}

export function createChildLogger(name: string): Logger {
  return logger.child({ module: name });
}

export { logger };
