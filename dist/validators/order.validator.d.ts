import { z } from 'zod';
export declare const createOrderSchema: z.ZodObject<{
    paymentMethod: z.ZodOptional<z.ZodNativeEnum<{
        PIX: "PIX";
        CARD: "CARD";
        CASH: "CASH";
        PAYMENT_ON_DELIVERY: "PAYMENT_ON_DELIVERY";
        PAYMENT_LINK: "PAYMENT_LINK";
    }>>;
    deliveryMethod: z.ZodOptional<z.ZodNativeEnum<{
        PICKUP: "PICKUP";
        STORE_DELIVERY: "STORE_DELIVERY";
        COURIER: "COURIER";
        THIRD_PARTY: "THIRD_PARTY";
    }>>;
    deliveryAddress: z.ZodOptional<z.ZodString>;
    notes: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    paymentMethod?: "PIX" | "CARD" | "CASH" | "PAYMENT_ON_DELIVERY" | "PAYMENT_LINK" | undefined;
    deliveryMethod?: "PICKUP" | "STORE_DELIVERY" | "COURIER" | "THIRD_PARTY" | undefined;
    deliveryAddress?: string | undefined;
    notes?: string | undefined;
}, {
    paymentMethod?: "PIX" | "CARD" | "CASH" | "PAYMENT_ON_DELIVERY" | "PAYMENT_LINK" | undefined;
    deliveryMethod?: "PICKUP" | "STORE_DELIVERY" | "COURIER" | "THIRD_PARTY" | undefined;
    deliveryAddress?: string | undefined;
    notes?: string | undefined;
}>;
export declare const updateOrderStatusSchema: z.ZodObject<{
    status: z.ZodNativeEnum<{
        PENDING: "PENDING";
        CONFIRMED: "CONFIRMED";
        PAYMENT_PENDING: "PAYMENT_PENDING";
        PAID: "PAID";
        PREPARING: "PREPARING";
        READY: "READY";
        OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY";
        DELIVERED: "DELIVERED";
        CANCELLED: "CANCELLED";
    }>;
}, "strip", z.ZodTypeAny, {
    status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED" | "PAYMENT_PENDING" | "PAID" | "OUT_FOR_DELIVERY";
}, {
    status: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED" | "PAYMENT_PENDING" | "PAID" | "OUT_FOR_DELIVERY";
}>;
export declare const cancelOrderSchema: z.ZodObject<{
    reason: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    reason?: string | undefined;
}, {
    reason?: string | undefined;
}>;
export declare const orderQuerySchema: z.ZodObject<{
    status: z.ZodOptional<z.ZodNativeEnum<{
        PENDING: "PENDING";
        CONFIRMED: "CONFIRMED";
        PAYMENT_PENDING: "PAYMENT_PENDING";
        PAID: "PAID";
        PREPARING: "PREPARING";
        READY: "READY";
        OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY";
        DELIVERED: "DELIVERED";
        CANCELLED: "CANCELLED";
    }>>;
    customerId: z.ZodOptional<z.ZodString>;
    limit: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    offset: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    limit: number;
    offset: number;
    status?: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED" | "PAYMENT_PENDING" | "PAID" | "OUT_FOR_DELIVERY" | undefined;
    customerId?: string | undefined;
}, {
    status?: "PENDING" | "CONFIRMED" | "PREPARING" | "READY" | "DELIVERED" | "CANCELLED" | "PAYMENT_PENDING" | "PAID" | "OUT_FOR_DELIVERY" | undefined;
    limit?: number | undefined;
    customerId?: string | undefined;
    offset?: number | undefined;
}>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type OrderQueryParams = z.infer<typeof orderQuerySchema>;
//# sourceMappingURL=order.validator.d.ts.map