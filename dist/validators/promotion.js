"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.promotionIdParamsSchema = exports.listPromotionsQuerySchema = exports.addPromotionProductSchema = exports.addPromotionRuleSchema = exports.updatePromotionSchema = exports.createPromotionSchema = void 0;
const zod_1 = require("zod");
/**
 * Schema for creating a promotion
 */
exports.createPromotionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name must be less than 100 characters'),
    description: zod_1.z.string().max(500, 'Description must be less than 500 characters').optional(),
    type: zod_1.z.enum(['PERCENTAGE', 'FIXED'], {
        errorMap: () => ({ message: 'Type must be either PERCENTAGE or FIXED' }),
    }),
    value: zod_1.z.number().positive('Value must be positive'),
    minAmount: zod_1.z.number().nonnegative('Minimum amount must be non-negative').optional(),
    startDate: zod_1.z.date({
        errorMap: () => ({ message: 'Start date must be a valid date' }),
    }),
    endDate: zod_1.z.date({
        errorMap: () => ({ message: 'End date must be a valid date' }),
    }),
    active: zod_1.z.boolean().default(true),
    rules: zod_1.z
        .array(zod_1.z.object({
        type: zod_1.z.enum(['CATEGORY', 'PRODUCT', 'DAY_OF_WEEK', 'MIN_QUANTITY', 'CUSTOMER_TYPE']),
        value: zod_1.z.string(),
    }))
        .optional(),
    productIds: zod_1.z.array(zod_1.z.string()).optional(),
});
/**
 * Schema for updating a promotion
 */
exports.updatePromotionSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(100).optional(),
    description: zod_1.z.string().max(500).optional(),
    type: zod_1.z.enum(['PERCENTAGE', 'FIXED']).optional(),
    value: zod_1.z.number().positive().optional(),
    minAmount: zod_1.z.number().nonnegative().optional(),
    startDate: zod_1.z.date().optional(),
    endDate: zod_1.z.date().optional(),
    active: zod_1.z.boolean().optional(),
});
/**
 * Schema for adding a rule to a promotion
 */
exports.addPromotionRuleSchema = zod_1.z.object({
    type: zod_1.z.enum(['CATEGORY', 'PRODUCT', 'DAY_OF_WEEK', 'MIN_QUANTITY', 'CUSTOMER_TYPE']),
    value: zod_1.z.string(),
});
/**
 * Schema for adding a product to a promotion
 */
exports.addPromotionProductSchema = zod_1.z.object({
    productId: zod_1.z.string(),
});
/**
 * Query parameters schema for listing promotions
 */
exports.listPromotionsQuerySchema = zod_1.z.object({
    active: zod_1.z
        .enum(['true', 'false'])
        .transform((val) => val === 'true')
        .optional(),
    limit: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().positive()).optional(),
    offset: zod_1.z.string().transform(Number).pipe(zod_1.z.number().int().nonnegative()).optional(),
});
/**
 * Route parameters schema for promotion ID
 */
exports.promotionIdParamsSchema = zod_1.z.object({
    id: zod_1.z.string(),
});
//# sourceMappingURL=promotion.js.map