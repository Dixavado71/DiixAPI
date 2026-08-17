import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/order/order.service';
import { OrderStateMachine } from '../services/order/order-state-machine';
import type { OrderStatus } from '@prisma/client';
import {
  createOrderSchema,
  updateOrderStatusSchema,
  cancelOrderSchema,
  orderQuerySchema,
} from '../validators/order.validator';
import { logger } from '../utils/logger';

export class OrderController {
  private orderService: OrderService;

  constructor() {
    this.orderService = new OrderService();
  }

  /**
   * Create an order from customer's active cart
   * POST /api/v1/stores/:storeId/orders
   */
  async createOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const customerId = req.body.customerId as string; // Will come from auth context in real scenario

      // Validate request body
      const validationResult = createOrderSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: validationResult.error.errors,
          },
        });
        return;
      }

      const orderResult = await this.orderService.createOrderFromCart({
        storeId,
        customerId,
        ...validationResult.data,
      });

      res.status(201).json({
        success: true,
        data: orderResult.order,
        message: orderResult.message,
      });
    } catch (error: unknown) {
      logger.error(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'Error creating order'
      );

      const errorMap: Record<string, { status: number; code: string }> = {
        CUSTOMER_NOT_AUTHORIZED: { status: 403, code: 'CUSTOMER_NOT_AUTHORIZED' },
        STORE_SETTINGS_NOT_FOUND: { status: 404, code: 'STORE_SETTINGS_NOT_FOUND' },
        COMMERCE_DISABLED: { status: 403, code: 'COMMERCE_DISABLED' },
        PAYMENT_METHOD_NOT_ENABLED: { status: 400, code: 'PAYMENT_METHOD_NOT_ENABLED' },
        DELIVERY_METHOD_NOT_ENABLED: { status: 400, code: 'DELIVERY_METHOD_NOT_ENABLED' },
        CART_NOT_FOUND: { status: 404, code: 'CART_NOT_FOUND' },
        CART_EMPTY: { status: 400, code: 'CART_EMPTY' },
        PRODUCT_NOT_FOUND: { status: 404, code: 'PRODUCT_NOT_FOUND' },
        PRODUCT_INACTIVE: { status: 400, code: 'PRODUCT_INACTIVE' },
        PRODUCT_STORE_MISMATCH: { status: 400, code: 'PRODUCT_STORE_MISMATCH' },
        OUT_OF_STOCK: { status: 409, code: 'OUT_OF_STOCK' },
      };

      const errorMessage = error instanceof Error ? error.message : '';
      const errorConfig = errorMap[errorMessage];
      if (errorConfig) {
        res.status(errorConfig.status).json({
          success: false,
          error: {
            code: errorConfig.code,
            message: errorMessage,
          },
        });
        return;
      }

      next(error);
    }
  }

  /**
   * Get all orders for a store
   * GET /api/v1/stores/:storeId/orders
   */
  async getOrders(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;

      // Validate query parameters
      const validationResult = orderQuerySchema.safeParse(req.query);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid query parameters',
            details: validationResult.error.errors,
          },
        });
        return;
      }

      const orders = await this.orderService.getOrdersByStore(storeId, {
        status: validationResult.data.status as OrderStatus | undefined,
        customerId: validationResult.data.customerId as string | undefined,
        limit: validationResult.data.limit,
        offset: validationResult.data.offset,
      });

      res.json({
        success: true,
        data: orders,
      });
    } catch (error: unknown) {
      logger.error(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'Error getting orders'
      );
      next(error);
    }
  }

  /**
   * Get a specific order by ID
   * GET /api/v1/stores/:storeId/orders/:orderId
   */
  async getOrderById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, storeId } = req.params as { orderId: string; storeId: string };

      const order = await this.orderService.getOrderById(orderId, storeId);

      res.json({
        success: true,
        data: order,
      });
    } catch (error: unknown) {
      logger.error(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'Error getting order'
      );

      if (
        error instanceof Error &&
        (error.message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH')
      ) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found',
          },
        });
        return;
      }

      next(error);
    }
  }

  /**
   * Update order status
   * PATCH /api/v1/stores/:storeId/orders/:orderId/status
   */
  async updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, storeId } = req.params as { orderId: string; storeId: string };

      // Validate request body
      const validationResult = updateOrderStatusSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid status',
            details: validationResult.error.errors,
          },
        });
        return;
      }

      const order = await this.orderService.updateOrderStatus(
        orderId,
        storeId,
        validationResult.data.status as OrderStatus
      );

      res.json({
        success: true,
        data: order,
        message: 'Order status updated successfully',
      });
    } catch (error: unknown) {
      logger.error(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'Error updating order status'
      );

      if (error instanceof Error && error.message.includes('Invalid state transition')) {
        res.status(422).json({
          success: false,
          error: {
            code: 'INVALID_STATE_TRANSITION',
            message: error.message,
          },
        });
        return;
      }

      if (
        error instanceof Error &&
        ((error as Error).message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH')
      ) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found',
          },
        });
        return;
      }

      next(error);
    }
  }

  /**
   * Cancel an order
   * POST /api/v1/stores/:storeId/orders/:orderId/cancel
   */
  async cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, storeId } = req.params as { orderId: string; storeId: string };

      // Validate request body
      const validationResult = cancelOrderSchema.safeParse(req.body);
      if (!validationResult.success) {
        res.status(400).json({
          success: false,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Invalid request body',
            details: validationResult.error.errors,
          },
        });
        return;
      }

      const order = await this.orderService.cancelOrder(
        orderId,
        storeId,
        validationResult.data.reason as string | undefined
      );

      res.json({
        success: true,
        data: order,
        message: 'Order cancelled successfully',
      });
    } catch (error: unknown) {
      logger.error(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'Error cancelling order'
      );

      if (error instanceof Error && error.message.includes('ORDER_CANNOT_BE_CANCELLED')) {
        res.status(422).json({
          success: false,
          error: {
            code: 'INVALID_STATE_TRANSITION',
            message: error.message,
          },
        });
        return;
      }

      if (
        error instanceof Error &&
        ((error as Error).message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH')
      ) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found',
          },
        });
        return;
      }

      next(error);
    }
  }

  /**
   * Get possible next states for an order
   * GET /api/v1/stores/:storeId/orders/:orderId/possible-states
   */
  async getPossibleStates(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { orderId, storeId } = req.params as { orderId: string; storeId: string };

      const order = await this.orderService.getOrderById(orderId, storeId);

      const possibleStates = OrderStateMachine.getPossibleNextStates(order.status);
      const canCancel = OrderStateMachine.canCancel(order.status);
      const isTerminal = OrderStateMachine.isTerminalState(order.status);
      const isFinal = OrderStateMachine.isFinalState(order.status);

      res.json({
        success: true,
        data: {
          currentStatus: order.status,
          possibleNextStates: possibleStates,
          canCancel,
          isTerminalState: isTerminal,
          isFinalState: isFinal,
        },
      });
    } catch (error: unknown) {
      logger.error(
        { error: error instanceof Error ? error.message : 'Unknown error' },
        'Error getting possible states'
      );

      if (
        error instanceof Error &&
        ((error as Error).message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH')
      ) {
        res.status(404).json({
          success: false,
          error: {
            code: 'ORDER_NOT_FOUND',
            message: 'Order not found',
          },
        });
        return;
      }

      next(error);
    }
  }
}
