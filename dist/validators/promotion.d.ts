import { z } from 'zod';
/**
 * Schema for creating a promotion
 */
export declare const createPromotionSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodEnum<["PERCENTAGE", "FIXED"]>;
    value: z.ZodNumber;
    minAmount: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodDate;
    endDate: z.ZodDate;
    active: z.ZodDefault<z.ZodBoolean>;
    rules: z.ZodOptional<z.ZodArray<z.ZodObject<{
        type: z.ZodEnum<["CATEGORY", "PRODUCT", "DAY_OF_WEEK", "MIN_QUANTITY", "CUSTOMER_TYPE"]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        type: "CATEGORY" | "PRODUCT" | "DAY_OF_WEEK" | "MIN_QUANTITY" | "CUSTOMER_TYPE";
        value: string;
    }, {
        type: "CATEGORY" | "PRODUCT" | "DAY_OF_WEEK" | "MIN_QUANTITY" | "CUSTOMER_TYPE";
        value: string;
    }>, "many">>;
    productIds: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
}, "strip", z.ZodTypeAny, {
    name: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    active: boolean;
    startDate: Date;
    endDate: Date;
    description?: string | undefined;
    minAmount?: number | undefined;
    rules?: {
        type: "CATEGORY" | "PRODUCT" | "DAY_OF_WEEK" | "MIN_QUANTITY" | "CUSTOMER_TYPE";
        value: string;
    }[] | undefined;
    productIds?: string[] | undefined;
}, {
    name: string;
    type: "PERCENTAGE" | "FIXED";
    value: number;
    startDate: Date;
    endDate: Date;
    description?: string | undefined;
    active?: boolean | undefined;
    minAmount?: number | undefined;
    rules?: {
        type: "CATEGORY" | "PRODUCT" | "DAY_OF_WEEK" | "MIN_QUANTITY" | "CUSTOMER_TYPE";
        value: string;
    }[] | undefined;
    productIds?: string[] | undefined;
}>;
/**
 * Schema for updating a promotion
 */
export declare const updatePromotionSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodString>;
    type: z.ZodOptional<z.ZodEnum<["PERCENTAGE", "FIXED"]>>;
    value: z.ZodOptional<z.ZodNumber>;
    minAmount: z.ZodOptional<z.ZodNumber>;
    startDate: z.ZodOptional<z.ZodDate>;
    endDate: z.ZodOptional<z.ZodDate>;
    active: z.ZodOptional<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    type?: "PERCENTAGE" | "FIXED" | undefined;
    value?: number | undefined;
    description?: string | undefined;
    active?: boolean | undefined;
    minAmount?: number | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}, {
    name?: string | undefined;
    type?: "PERCENTAGE" | "FIXED" | undefined;
    value?: number | undefined;
    description?: string | undefined;
    active?: boolean | undefined;
    minAmount?: number | undefined;
    startDate?: Date | undefined;
    endDate?: Date | undefined;
}>;
/**
 * Schema for adding a rule to a promotion
 */
export declare const addPromotionRuleSchema: z.ZodObject<{
    type: z.ZodEnum<["CATEGORY", "PRODUCT", "DAY_OF_WEEK", "MIN_QUANTITY", "CUSTOMER_TYPE"]>;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    type: "CATEGORY" | "PRODUCT" | "DAY_OF_WEEK" | "MIN_QUANTITY" | "CUSTOMER_TYPE";
    value: string;
}, {
    type: "CATEGORY" | "PRODUCT" | "DAY_OF_WEEK" | "MIN_QUANTITY" | "CUSTOMER_TYPE";
    value: string;
}>;
/**
 * Schema for adding a product to a promotion
 */
export declare const addPromotionProductSchema: z.ZodObject<{
    productId: z.ZodString;
}, "strip", z.ZodTypeAny, {
    productId: string;
}, {
    productId: string;
}>;
/**
 * Query parameters schema for listing promotions
 */
export declare const listPromotionsQuerySchema: z.ZodObject<{
    active: z.ZodOptional<z.ZodEffects<z.ZodEnum<["true", "false"]>, boolean, "true" | "false">>;
    limit: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
    offset: z.ZodOptional<z.ZodPipeline<z.ZodEffects<z.ZodString, number, string>, z.ZodNumber>>;
}, "strip", z.ZodTypeAny, {
    active?: boolean | undefined;
    limit?: number | undefined;
    offset?: number | undefined;
}, {
    active?: "true" | "false" | undefined;
    limit?: string | undefined;
    offset?: string | undefined;
}>;
/**
 * Route parameters schema for promotion ID
 */
export declare const promotionIdParamsSchema: z.ZodObject<{
    id: z.ZodString;
}, "strip", z.ZodTypeAny, {
    id: string;
}, {
    id: string;
}>;
/**
 * Type inference
 */
export type CreatePromotionInput = z.infer<typeof createPromotionSchema>;
export type UpdatePromotionInput = z.infer<typeof updatePromotionSchema>;
export type AddPromotionRuleInput = z.infer<typeof addPromotionRuleSchema>;
export type AddPromotionProductInput = z.infer<typeof addPromotionProductSchema>;
export type ListPromotionsQuery = z.infer<typeof listPromotionsQuerySchema>;
//# sourceMappingURL=promotion.d.ts.map