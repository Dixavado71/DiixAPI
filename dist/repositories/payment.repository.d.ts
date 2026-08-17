import { PrismaClient } from '@prisma/client';
export declare class PaymentRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    create(data: {
        orderId: string;
        method: string;
        amount: number;
        transactionId?: string;
        metadata?: Record<string, unknown>;
    }): Promise<{
        order: {
            status: import(".prisma/client").$Enums.OrderStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
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
        };
    } & {
        method: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
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
            createdAt: Date;
            updatedAt: Date;
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
        };
    } & {
        method: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
    }) | null>;
    findByOrderId(orderId: string): Promise<{
        method: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
    }[]>;
    updateStatus(id: string, status: string, transactionId?: string, metadata?: Record<string, unknown>): Promise<{
        method: import(".prisma/client").$Enums.PaymentMethod;
        status: import(".prisma/client").$Enums.PaymentStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        orderId: string;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
    }>;
}
//# sourceMappingURL=payment.repository.d.ts.map