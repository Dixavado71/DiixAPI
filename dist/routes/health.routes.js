import { Router } from 'express';
import { checkDatabaseHealth } from '../config/database';
import { getLogger } from '../utils/logger';
const router = Router();
const logger = getLogger().child({ module: 'health' });
/**
 * GET /api/v1/health
 * Basic health check - returns service status
 */
router.get('/', (_req, res) => {
    res.json({
        status: 'ok',
        service: 'ecms6',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
    });
});
/**
 * GET /api/v1/health/ready
 * Readiness check - verifies database connectivity
 */
router.get('/ready', async (_req, res) => {
    try {
        const databaseHealthy = await checkDatabaseHealth();
        const isReady = databaseHealthy;
        if (!isReady) {
            logger.warn({ database: databaseHealthy }, 'Service not ready');
            res.status(503).json({
                status: 'not_ready',
                service: 'ecms6',
                version: '1.0.0',
                timestamp: new Date().toISOString(),
                checks: {
                    database: databaseHealthy,
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
            },
        });
    }
    catch (error) {
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
//# sourceMappingURL=health.routes.js.map