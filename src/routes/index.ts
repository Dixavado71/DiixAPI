import { Router } from 'express';
import healthRoutes from './health.routes';
import webhookRoutes from './webhook.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/webhooks', webhookRoutes);

export default router;
