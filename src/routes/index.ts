import { Router } from 'express';
import healthRoutes from './health.routes';
import webhookRoutes from './webhook.routes';
import { createOrderRoutes } from './order.routes';
import { PromotionRoutes } from './promotion.routes';
import { CartRoutes } from './cart.routes';
import { botRoutes } from './bot.routes';
import { adminRoutes } from './admin.routes';

const router = Router();

// Health check
router.use('/health', healthRoutes);

// Webhooks
router.use('/webhooks', webhookRoutes);

// Store-specific routes
router.use('/orders', createOrderRoutes());
router.use('/stores/:storeId/promotions', new PromotionRoutes().getRouter());
router.use('/stores/:storeId/customers/:customerId/cart', new CartRoutes().getRouter());

// Bot routes
router.use('/api/bot', botRoutes);

// Admin routes (Auth + RBAC + Audit)
router.use('/admin', adminRoutes);

export default router;
