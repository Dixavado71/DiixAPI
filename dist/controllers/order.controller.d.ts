import { Request, Response, NextFunction } from 'express';
export declare class OrderController {
    private orderService;
    constructor();
    /**
     * Create an order from customer's active cart
     * POST /api/v1/stores/:storeId/orders
     */
    createOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all orders for a store
     * GET /api/v1/stores/:storeId/orders
     */
    getOrders(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get a specific order by ID
     * GET /api/v1/stores/:storeId/orders/:orderId
     */
    getOrderById(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update order status
     * PATCH /api/v1/stores/:storeId/orders/:orderId/status
     */
    updateOrderStatus(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Cancel an order
     * POST /api/v1/stores/:storeId/orders/:orderId/cancel
     */
    cancelOrder(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get possible next states for an order
     * GET /api/v1/stores/:storeId/orders/:orderId/possible-states
     */
    getPossibleStates(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=order.controller.d.ts.map