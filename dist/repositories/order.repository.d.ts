import { PrismaClient, Order, OrderStatus } from '@prisma/client';
export declare class OrderRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<Order | null>;
    findByOrderNumber(orderNumber: string): Promise<Order | null>;
    findByStore(storeId: string, options?: {
        status?: OrderStatus;
        customerId?: string;
        limit?: number;
        offset?: number;
    }): Promise<Order[]>;
    create(data: {
        storeId: string;
        customerId: string;
        orderNumber: string;
        subtotal: number;
        discount: number;
        total: number;
        paymentMethod?: any;
        deliveryMethod?: any;
        deliveryAddress?: string;
        deliveryFee?: number;
        notes?: string;
        items: {
            productId: string;
            quantity: number;
            unitPrice: number;
            totalPrice: number;
        }[];
    }): Promise<Order>;
    updateStatus(id: string, status: OrderStatus): Promise<Order>;
    updatePaymentStatus(id: string, paymentStatus: any): Promise<Order>;
    countByStore(storeId: string): Promise<number>;
}
//# sourceMappingURL=order.repository.d.ts.map