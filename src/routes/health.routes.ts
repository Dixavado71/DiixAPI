import { Router, Request, Response } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { checkRedisHealth } from '../config/redis';
import { getLogger } from '../utils/logger';

const router = Router();
const logger = getLogger().child({ module: 'health' });

/**
 * GET /api/v1/health
 * Basic health check - returns service status
 */
router.get('/' as const, (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    service: 'ecms6',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
});

/**
 * GET /api/v1/health/ready
 * Readiness check - verifies database and Redis connectivity
 */
router.get('/ready' as const, async (_req: Request, res: Response) => {
  try {
    const [databaseHealthy, redisHealthy] = await Promise.all([
      checkDatabaseHealth(),
      checkRedisHealth(),
    ]);

    const isReady = databaseHealthy && redisHealthy;

    if (!isReady) {
      logger.warn({ database: databaseHealthy, redis: redisHealthy }, 'Service not ready');
      res.status(503).json({
        status: 'not_ready',
        service: 'ecms6',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        checks: {
          database: databaseHealthy,
          redis: redisHealthy,
        },
      });
      return;
    }

    logger.debug('Service ready');
    res.json({
      status: 'ready',
      service: 'ecms6',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      checks: {
        database: databaseHealthy,
        redis: redisHealthy,
      },
    });
  } catch (error) {
    logger.error({ error }, 'Health check failed');
    res.status(503).json({
      status: 'error',
      service: 'ecms6',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      error: 'Health check failed',
    });
  }
});

export default router;
