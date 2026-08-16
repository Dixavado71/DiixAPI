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
            storeId: string;
            id: string;
            customerId: string;
            createdAt: Date;
            updatedAt: Date;
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
        };
    } & {
        status: import(".prisma/client").$Enums.DeliveryStatus;
        storeId: string;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    }>;
    findById(id: string): Promise<({
        order: {
            items: {
                orderId: string;
                id: string;
                createdAt: Date;
                productId: string;
                quantity: number;
                unitPrice: import("@prisma/client/runtime/library").Decimal;
                totalPrice: import("@prisma/client/runtime/library").Decimal;
            }[];
        } & {
            status: import(".prisma/client").$Enums.OrderStatus;
            storeId: string;
            id: string;
            customerId: string;
            createdAt: Date;
            updatedAt: Date;
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
        };
    } & {
        status: import(".prisma/client").$Enums.DeliveryStatus;
        storeId: string;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    }) | null>;
    findByOrderId(orderId: string): Promise<{
        status: import(".prisma/client").$Enums.DeliveryStatus;
        storeId: string;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    } | null>;
    updateStatus(id: string, status: string, trackingInfo?: string): Promise<{
        status: import(".prisma/client").$Enums.DeliveryStatus;
        storeId: string;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.DeliveryMethod;
        createdAt: Date;
        updatedAt: Date;
        address: string;
        recipientName: string;
        recipientPhone: string;
        trackingInfo: string | null;
        deliveredAt: Date | null;
    }>;
}
//# sourceMappingURL=delivery.repository.d.ts.map