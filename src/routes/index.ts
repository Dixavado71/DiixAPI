import { Router } from 'express';
import healthRoutes from './health.routes';
import webhookRoutes from './webhook.routes';
import { createOrderRoutes } from './order.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/orders', createOrderRoutes());

export default router;
