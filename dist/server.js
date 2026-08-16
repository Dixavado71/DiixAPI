"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const env_1 = require("./config/env");
const database_1 = require("./config/database");
const redis_1 = require("./config/redis");
const logger_1 = require("./utils/logger");
const logger = (0, logger_1.getLogger)();
async function bootstrap() {
    // Validate environment variables
    const env = (0, env_1.validateEnv)();
    logger.info({ env: env.NODE_ENV }, 'Environment validated');
    // Connect to database
    await (0, database_1.connectDatabase)();
    // Create Express app
    const app = (0, app_1.createApp)();
    // Start server
    const port = env.PORT;
    const server = app.listen(port, () => {
        logger.info({ port, env: env.NODE_ENV }, `ECMS6 server listening on port ${port}`);
    });
    // Graceful shutdown
    const shutdown = async (signal) => {
        logger.info({ signal }, 'Graceful shutdown initiated');
        server.close(async () => {
            logger.info('HTTP server closed');
            try {
                await (0, database_1.disconnectDatabase)();
                await (0, redis_1.disconnectRedis)();
                logger.info('All connections closed');
                process.exit(0);
            }
            catch (error) {
                logger.error({ error }, 'Error during shutdown');
                process.exit(1);
            }
        });
        // Force shutdown after 30 seconds
        setTimeout(() => {
            logger.error('Forced shutdown after timeout');
            process.exit(1);
        }, 30000);
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
        logger.fatal({ error }, 'Uncaught exception');
        process.exit(1);
    });
    process.on('unhandledRejection', (reason, promise) => {
        logger.fatal({ reason }, 'Unhandled rejection at ' + promise.toString());
        process.exit(1);
    });
}
bootstrap().catch((error) => {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
});
//# sourceMappingURL=server.js.map