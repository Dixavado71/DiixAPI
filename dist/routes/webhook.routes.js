"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const zod_1 = require("zod");
const logger_1 = require("../utils/logger");
const webhook_service_1 = require("../services/webhook/webhook.service");
const router = (0, express_1.Router)();
const logger = (0, logger_1.getLogger)().child({ module: 'webhook' });
/**
 * Schema for validating Evolution API webhook payload
 * Adjust based on actual Evolution API v2.3.7 payload structure
 */
const webhookPayloadSchema = zod_1.z
    .object({
    event: zod_1.z.string(),
    instance: zod_1.z.string(),
    data: zod_1.z.record(zod_1.z.unknown()).optional(),
})
    .passthrough();
/**
 * POST /api/v1/webhooks/evolution
 * Receives webhooks from Evolution API
 */
router.post('/evolution', async (req, res) => {
    try {
        const payload = req.body;
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
        // Process webhook through service
        const result = await webhook_service_1.webhookService.processWebhook(payload);
        // Acknowledge receipt
        res.status(200).json({
            status: 'processed',
            eventId: result.eventId,
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