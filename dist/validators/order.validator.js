"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderQuerySchema = exports.cancelOrderSchema = exports.updateOrderStatusSchema = exports.createOrderSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
// Schema for creating an order
exports.createOrderSchema = zod_1.z.object({
    paymentMethod: zod_1.z.nativeEnum(client_1.PaymentMethod).optional(),
    deliveryMethod: zod_1.z.nativeEnum(client_1.DeliveryMethod).optional(),
    deliveryAddress: zod_1.z.string().min(5).max(500).optional(),
    notes: zod_1.z.string().max(1000).optional(),
});
// Schema for updating order status
exports.updateOrderStatusSchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.OrderStatus),
});
// Schema for cancelling an order
exports.cancelOrderSchema = zod_1.z.object({
    reason: zod_1.z.string().max(500).optional(),
});
// Schema for query parameters
exports.orderQuerySchema = zod_1.z.object({
    status: zod_1.z.nativeEnum(client_1.OrderStatus).optional(),
    customerId: zod_1.z.string().cuid().optional(),
    limit: zod_1.z.coerce.number().min(1).max(100).optional().default(50),
    offset: zod_1.z.coerce.number().min(0).optional().default(0),
});
//# sourceMappingURL=order.validator.js.map