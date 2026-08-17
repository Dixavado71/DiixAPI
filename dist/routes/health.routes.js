"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = require("../config/database");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
const logger = (0, logger_1.getLogger)().child({ module: 'health' });
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
        const databaseHealthy = await (0, database_1.checkDatabaseHealth)();
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
exports.default = router;
//# sourceMappingURL=health.routes.js.map