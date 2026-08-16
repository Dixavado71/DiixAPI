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
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
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
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }) | null>;
    findByOrderId(orderId: string): Promise<{
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }[]>;
    updateStatus(id: string, status: string, transactionId?: string, metadata?: Record<string, unknown>): Promise<{
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        id: string;
        method: import(".prisma/client").$Enums.PaymentMethod;
        createdAt: Date;
        updatedAt: Date;
        amount: import("@prisma/client/runtime/library").Decimal;
        transactionId: string | null;
        metadata: import("@prisma/client/runtime/library").JsonValue | null;
    }>;
}
//# sourceMappingURL=payment.repository.d.ts.map