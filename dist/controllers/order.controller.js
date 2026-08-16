"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderController = void 0;
const order_service_1 = require("../services/order/order.service");
const order_state_machine_1 = require("../services/order/order-state-machine");
const order_validator_1 = require("../validators/order.validator");
const logger_1 = require("../utils/logger");
class OrderController {
    orderService;
    constructor() {
        this.orderService = new order_service_1.OrderService();
    }
    /**
     * Create an order from customer's active cart
     * POST /api/v1/stores/:storeId/orders
     */
    async createOrder(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const customerId = req.body.customerId; // Will come from auth context in real scenario
            // Validate request body
            const validationResult = order_validator_1.createOrderSchema.safeParse(req.body);
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
        }
        catch (error) {
            logger_1.logger.error({ error: error.message }, 'Error creating order');
            const errorMap = {
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
            const errorConfig = errorMap[error.message];
            if (errorConfig) {
                res.status(errorConfig.status).json({
                    success: false,
                    error: {
                        code: errorConfig.code,
                        message: error.message,
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
    async getOrders(req, res, next) {
        try {
            const storeId = req.params.storeId;
            // Validate query parameters
            const validationResult = order_validator_1.orderQuerySchema.safeParse(req.query);
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
                status: validationResult.data.status,
                customerId: validationResult.data.customerId,
                limit: validationResult.data.limit,
                offset: validationResult.data.offset,
            });
            res.json({
                success: true,
                data: orders,
            });
        }
        catch (error) {
            logger_1.logger.error({ error: error.message }, 'Error getting orders');
            next(error);
        }
    }
    /**
     * Get a specific order by ID
     * GET /api/v1/stores/:storeId/orders/:orderId
     */
    async getOrderById(req, res, next) {
        try {
            const { orderId, storeId } = req.params;
            const order = await this.orderService.getOrderById(orderId, storeId);
            res.json({
                success: true,
                data: order,
            });
        }
        catch (error) {
            logger_1.logger.error({ error: error.message }, 'Error getting order');
            if (error.message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH') {
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
    async updateOrderStatus(req, res, next) {
        try {
            const { orderId, storeId } = req.params;
            // Validate request body
            const validationResult = order_validator_1.updateOrderStatusSchema.safeParse(req.body);
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
            const order = await this.orderService.updateOrderStatus(orderId, storeId, validationResult.data.status);
            res.json({
                success: true,
                data: order,
                message: 'Order status updated successfully',
            });
        }
        catch (error) {
            logger_1.logger.error({ error: error.message }, 'Error updating order status');
            if (error.message.includes('Invalid state transition')) {
                res.status(422).json({
                    success: false,
                    error: {
                        code: 'INVALID_STATE_TRANSITION',
                        message: error.message,
                    },
                });
                return;
            }
            if (error.message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH') {
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
    async cancelOrder(req, res, next) {
        try {
            const { orderId, storeId } = req.params;
            // Validate request body
            const validationResult = order_validator_1.cancelOrderSchema.safeParse(req.body);
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
            const order = await this.orderService.cancelOrder(orderId, storeId, validationResult.data.reason);
            res.json({
                success: true,
                data: order,
                message: 'Order cancelled successfully',
            });
        }
        catch (error) {
            logger_1.logger.error({ error: error.message }, 'Error cancelling order');
            if (error.message.includes('ORDER_CANNOT_BE_CANCELLED')) {
                res.status(422).json({
                    success: false,
                    error: {
                        code: 'INVALID_STATE_TRANSITION',
                        message: error.message,
                    },
                });
                return;
            }
            if (error.message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH') {
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
    async getPossibleStates(req, res, next) {
        try {
            const { orderId, storeId } = req.params;
            const order = await this.orderService.getOrderById(orderId, storeId);
            const possibleStates = order_state_machine_1.OrderStateMachine.getPossibleNextStates(order.status);
            const canCancel = order_state_machine_1.OrderStateMachine.canCancel(order.status);
            const isTerminal = order_state_machine_1.OrderStateMachine.isTerminalState(order.status);
            const isFinal = order_state_machine_1.OrderStateMachine.isFinalState(order.status);
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
        }
        catch (error) {
            logger_1.logger.error({ error: error.message }, 'Error getting possible states');
            if (error.message === 'ORDER_NOT_FOUND' || error.message === 'ORDER_STORE_MISMATCH') {
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
exports.OrderController = OrderController;
//# sourceMappingURL=order.controller.js.map