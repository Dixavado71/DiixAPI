import pino, { Logger } from 'pino';

let logger: Logger;

export function getLogger(): Logger {
  if (!logger) {
    const logLevel = process.env.LOG_LEVEL || 'info';

    logger = pino({
      level: logLevel,
      timestamp: pino.stdTimeFunctions.isoTime,
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

export function createChildLogger(name: string): Logger {
  return getLogger().child({ module: name });
}
