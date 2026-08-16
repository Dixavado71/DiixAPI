import { z } from 'zod';
import { OrderStatus, PaymentMethod, DeliveryMethod } from '@prisma/client';

// Schema for creating an order
export const createOrderSchema = z.object({
  paymentMethod: z.nativeEnum(PaymentMethod).optional(),
  deliveryMethod: z.nativeEnum(DeliveryMethod).optional(),
  deliveryAddress: z.string().min(5).max(500).optional(),
  notes: z.string().max(1000).optional(),
});

// Schema for updating order status
export const updateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
});

// Schema for cancelling an order
export const cancelOrderSchema = z.object({
  reason: z.string().max(500).optional(),
});

// Schema for query parameters
export const orderQuerySchema = z.object({
  status: z.nativeEnum(OrderStatus).optional(),
  customerId: z.string().cuid().optional(),
  limit: z.coerce.number().min(1).max(100).optional().default(50),
  offset: z.coerce.number().min(0).optional().default(0),
});

// Type exports
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;
export type CancelOrderInput = z.infer<typeof cancelOrderSchema>;
export type OrderQueryParams = z.infer<typeof orderQuerySchema>;
