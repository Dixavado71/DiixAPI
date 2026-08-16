"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const router = (0, express_1.Router)();
const logger = (0, logger_1.getLogger)().child({ module: 'webhook' });
/**
 * Schema for validating Evolution API webhook payload
 * Adjust based on actual Evolution API v2.3.7 payload structure
 */
const webhookPayloadSchema = zod_1.z.object({
    event: zod_1.z.string(),
    instance: zod_1.z.string(),
    data: zod_1.z.record(zod_1.z.unknown()).optional(),
}).passthrough();
/**
 * POST /api/v1/webhooks/evolution
 * Receives webhooks from Evolution API
 */
router.post('/evolution', async (_req, res) => {
    try {
        const payload = _req.body;
        // Validate basic payload structure
        const validationResult = webhookPayloadSchema.safeParse(payload);
        if (!validationResult.success) {
            logger.warn({ error: validationResult.error }, 'Invalid webhook payload');
            res.status(400).json({
                status: 'error',
                message: 'Invalid payload structure',
            });
            return;
        }
        const { event, instance } = validationResult.data;
        logger.info({
            event,
            instance,
            hasData: !!payload.data,
        }, 'Webhook received from Evolution API');
        // TODO: Implement full webhook processing pipeline
        // - Validate webhook secret
        // - Check idempotency (prevent duplicate processing)
        // - Parse event type
        // - Resolve store and customer
        // - Process conversation state
        // - Trigger bot engine
        // For now, acknowledge receipt
        res.status(200).json({
            status: 'received',
            eventId: crypto.randomUUID(),
            timestamp: new Date().toISOString(),
        });
    }
    catch (error) {
        logger.error({ error }, 'Error processing webhook');
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
        });
    }
});
exports.default = router;
//# sourceMappingURL=webhook.routes.js.map