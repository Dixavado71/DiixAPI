import { createApp } from './app';
import { validateEnv } from './config/env';
import { connectDatabase, disconnectDatabase } from './config/database';
import { getLogger } from './utils/logger';

const logger = getLogger();

async function bootstrap(): Promise<void> {
  // Validate environment variables
  const env = validateEnv();
  logger.info({ env: env.NODE_ENV }, 'Environment validated');

  // Connect to database
  await connectDatabase();

  // Create Express app
  const app = createApp();

  // Start server
  const port = env.PORT;

  const server = app.listen(port, () => {
    logger.info({ port, env: env.NODE_ENV }, `ECMS6 server listening on port ${port}`);
  });

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info({ signal }, 'Graceful shutdown initiated');

    server.close(async () => {
      logger.info('HTTP server closed');

      try {
        await disconnectDatabase();
        logger.info('All connections closed');
        process.exit(0);
      } catch (error) {
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
