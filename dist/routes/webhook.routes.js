import { Router } from 'express';
import { z } from 'zod';
import { getLogger } from '../utils/logger';
import { webhookService } from '../services/webhook/webhook.service';
const router = Router();
const logger = getLogger().child({ module: 'webhook' });
/**
 * Schema for validating Evolution API webhook payload
 * Adjust based on actual Evolution API v2.3.7 payload structure
 */
const webhookPayloadSchema = z
    .object({
    event: z.string(),
    instance: z.string(),
    data: z.record(z.unknown()).optional(),
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
        const result = await webhookService.processWebhook(payload);
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
export default router;
//# sourceMappingURL=webhook.routes.js.map