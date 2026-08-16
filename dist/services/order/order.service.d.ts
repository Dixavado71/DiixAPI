import { Order, OrderStatus, PaymentMethod, DeliveryMethod } from '@prisma/client';
interface CreateOrderInput {
    storeId: string;
    customerId: string;
    paymentMethod?: PaymentMethod;
    deliveryMethod?: DeliveryMethod;
    deliveryAddress?: string;
    notes?: string;
}
interface OrderResult {
    order: Order;
    message: string;
}
export declare class OrderService {
    private orderRepository;
    private cartRepository;
    private productRepository;
    private storeSettingsRepository;
    private promotionService;
    constructor();
    /**
     * Generate unique order number
     */
    private generateOrderNumber;
    /**
     * Create an order from the customer's active cart
     */
    createOrderFromCart(input: CreateOrderInput): Promise<OrderResult>;
    /**
     * Get order by ID
     */
    getOrderById(orderId: string, storeId: string): Promise<Order>;
    /**
     * Get orders by store with optional filters
     */
    getOrdersByStore(storeId: string, options?: {
        status?: OrderStatus;
        customerId?: string;
        limit?: number;
        offset?: number;
    }): Promise<Order[]>;
    /**
     * Update order status with state machine validation
     */
    updateOrderStatus(orderId: string, storeId: string, newStatus: OrderStatus): Promise<Order>;
    /**
     * Cancel an order
     */
    cancelOrder(orderId: string, storeId: string, reason?: string): Promise<Order>;
    /**
     * Update payment status
     */
    updatePaymentStatus(orderId: string, storeId: string, paymentStatus: any): Promise<Order>;
}
export {};
//# sourceMappingURL=order.service.d.ts.map