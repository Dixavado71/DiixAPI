import { Router } from 'express';
import healthRoutes from './health.routes.js';
import webhookRoutes from './webhook.routes.js';
import orderRoutes from './order.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/orders', orderRoutes);

export default router;
