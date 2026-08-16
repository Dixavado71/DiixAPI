import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';

export function createOrderRoutes(): Router {
  const router = Router();
  const controller = new OrderController();

  /**
   * @route   POST /api/v1/stores/:storeId/orders
   * @desc    Create a new order from customer's cart
   * @access  Private (customer must be authorized)
   */
  router.post('/', (req, res, next) => controller.createOrder(req, res, next));

  /**
   * @route   GET /api/v1/stores/:storeId/orders
   * @desc    Get all orders for a store with optional filters
   * @access  Private
   */
  router.get('/', (req, res, next) => controller.getOrders(req, res, next));

  /**
   * @route   GET /api/v1/stores/:storeId/orders/:orderId
   * @desc    Get a specific order by ID
   * @access  Private
   */
  router.get('/:orderId', (req, res, next) => controller.getOrderById(req, res, next));

  /**
   * @route   PATCH /api/v1/stores/:storeId/orders/:orderId/status
   * @desc    Update order status with state machine validation
   * @access  Private (store staff only)
   */
  router.patch('/:orderId/status', (req, res, next) => controller.updateOrderStatus(req, res, next));

  /**
   * @route   POST /api/v1/stores/:storeId/orders/:orderId/cancel
   * @desc    Cancel an order
   * @access  Private
   */
  router.post('/:orderId/cancel', (req, res, next) => controller.cancelOrder(req, res, next));

  /**
   * @route   GET /api/v1/stores/:storeId/orders/:orderId/possible-states
   * @desc    Get possible next states for an order
   * @access  Private
   */
  router.get('/:orderId/possible-states', (req, res, next) => controller.getPossibleStates(req, res, next));

  return router;
}
