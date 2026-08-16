import { Router } from 'express';
import healthRoutes from './health.routes';
import webhookRoutes from './webhook.routes';
import { createOrderRoutes } from './order.routes';
import { PromotionRoutes } from './promotion.routes';
import { CartRoutes } from './cart.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/webhooks', webhookRoutes);
router.use('/orders', createOrderRoutes());
router.use('/stores/:storeId/promotions', new PromotionRoutes().getRouter());
router.use(
  '/stores/:storeId/customers/:customerId/cart',
  new CartRoutes().getRouter()
);

export default router;

// Bot routes
import { botRoutes } from './bot.routes';
app.use('/api/bot', botRoutes);
