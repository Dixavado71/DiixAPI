import { PrismaClient } from '@prisma/client';
export declare class DeliveryRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: {
        orderId: string;
        storeId: string;
        method: string;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo?: string;
    }): Promise<{
        order: {
            status: import(".prisma/client").$Enums.OrderStatus;
            id: string;
            storeId: string;
            customerId: string;
            orderNumber: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod | null;
            deliveryAddress: string | null;
            deliveryFee: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import(".prisma/client").$Enums.DeliveryStatus;
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    }>;
    findById(id: string): Promise<({
        order: {
            items: {
                id: string;
                createdAt: Date;
                productId: string;
                quantity: number;
                orderId: string;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: import(".prisma/client").$Enums.OrderStatus;
            id: string;
            storeId: string;
            customerId: string;
            orderNumber: string;
            subtotal: import("@prisma/client/runtime/library").Decimal;
            discount: import("@prisma/client/runtime/library").Decimal;
            total: import("@prisma/client/runtime/library").Decimal;
            paymentMethod: import(".prisma/client").$Enums.PaymentMethod | null;
            paymentStatus: import(".prisma/client").$Enums.PaymentStatus;
            deliveryMethod: import(".prisma/client").$Enums.DeliveryMethod | null;
            deliveryAddress: string | null;
            deliveryFee: import("@prisma/client/runtime/library").Decimal;
            notes: string | null;
            createdAt: Date;
            updatedAt: Date;
        };
    } & {
        status: import(".prisma/client").$Enums.DeliveryStatus;
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    }) | null>;
    findByOrderId(orderId: string): Promise<{
        status: import(".prisma/client").$Enums.DeliveryStatus;
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    } | null>;
    updateStatus(id: string, status: string, trackingInfo?: string): Promise<{
        status: import(".prisma/client").$Enums.DeliveryStatus;
        id: string;
        storeId: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    }>;
}
//# sourceMappingURL=delivery.repository.d.ts.map