import pino, { Logger } from 'pino';
declare const logger: pino.Logger<never, boolean>;
export declare function getLogger(): Logger;
export declare function createChildLogger(name: string): Logger;
export { logger };
//# sourceMappingURL=logger.d.ts.map