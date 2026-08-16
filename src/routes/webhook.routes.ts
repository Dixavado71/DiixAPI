import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { getLogger } from '../utils/logger';

const router = Router();
const logger = getLogger().child({ module: 'webhook' });

/**
 * Schema for validating Evolution API webhook payload
 * Adjust based on actual Evolution API v2.3.7 payload structure
 */
const webhookPayloadSchema = z.object({
  event: z.string(),
  instance: z.string(),
  data: z.record(z.unknown()).optional(),
}).passthrough();

/**
 * POST /api/v1/webhooks/evolution
 * Receives webhooks from Evolution API
 */
router.post('/evolution' as const, async (_req: Request, res: Response) => {
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

    logger.info(
      { 
        event, 
        instance,
        hasData: !!payload.data,
      },
      'Webhook received from Evolution API'
    );

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
  } catch (error) {
    logger.error({ error }, 'Error processing webhook');
    res.status(500).json({
      status: 'error',
      message: 'Internal server error',
    });
  }
});

export default router;
