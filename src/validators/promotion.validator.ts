import { z } from 'zod';

/**
 * Schema for creating a promotion
 */
export const createPromotionSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
  description: z.string().max(500, 'Description must be less than 500 characters').optional(),
  type: z.enum(['PERCENTAGE', 'FIXED'], {
    errorMap: () => ({ message: 'Type must be either PERCENTAGE or FIXED' }),
  }),
  value: z.number().positive('Value must be positive'),
  minAmount: z.number().nonnegative('Minimum amount must be non-negative').optional(),
  startDate: z.date({
    errorMap: () => ({ message: 'Start date must be a valid date' }),
  }),
  endDate: z.date({
    errorMap: () => ({ message: 'End date must be a valid date' }),
  }),
  active: z.boolean().default(true),
  rules: z
    .array(
      z.object({
        type: z.enum(['CATEGORY', 'PRODUCT', 'DAY_OF_WEEK', 'MIN_QUANTITY', 'CUSTOMER_TYPE']),
        value: z.string(),
      })
    )
    .optional(),
  productIds: z.array(z.string()).optional(),
});

/**
 * Schema for updating a promotion
 */
export const updatePromotionSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  type: z.enum(['PERCENTAGE', 'FIXED']).optional(),
  value: z.number().positive().optional(),
  minAmount: z.number().nonnegative().optional(),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
  active: z.boolean().optional(),
});

/**
 * Schema for adding a rule to a promotion
 */
export const addPromotionRuleSchema = z.object({
  type: z.enum(['CATEGORY', 'PRODUCT', 'DAY_OF_WEEK', 'MIN_QUANTITY', 'CUSTOMER_TYPE']),
  value: z.string(),
});

/**
 * Schema for adding a product to a promotion
 */
export const addPromotionProductSchema = z.object({
  productId: z.string(),
});

/**
 * Query parameters schema for listing promotions
 */
export const listPromotionsQuerySchema = z.object({
  active: z
    .enum(['true', 'false'])
    .transform((val) => val === 'true')
    .optional(),
  limit: z.string().transform(Number).pipe(z.number().int().positive()).optional(),
  offset: z.string().transform(Number).pipe(z.number().int().nonnegative()).optional(),
});

/**
 * Route parameters schema for promotion ID
 */
export const promotionIdParamsSchema = z.object({
  id: z.string(),
});

/**
 * Type inference
 */
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;
export type AddPromotionRuleInput = z.infer<typeof addPromotionRuleSchema>;
export type AddPromotionProductInput = z.infer<typeof addPromotionProductSchema>;
export type ListPromotionsQuery = z.infer<typeof listPromotionsQuerySchema>;
