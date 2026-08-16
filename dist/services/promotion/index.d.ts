import { Promotion, PromotionRule, PromotionProduct, RuleType } from '@prisma/client';
interface CreatePromotionInput {
    storeId: string;
    name: string;
    description?: string;
    type: 'PERCENTAGE' | 'FIXED';
    value: number;
    minAmount?: number;
    startDate: Date;
    endDate: Date;
    active?: boolean;
    rules?: Array<{
        type: RuleType;
        value: string;
    }>;
    productIds?: string[];
}
interface UpdatePromotionInput {
    name?: string;
    description?: string;
    type?: 'PERCENTAGE' | 'FIXED';
    value?: number;
    minAmount?: number;
    startDate?: Date;
    endDate?: Date;
    active?: boolean;
}
export declare class PromotionService {
    private promotionRepository;
    private productRepository;
    constructor();
    /**
     * Validate promotion date range
     */
    private validateDateRange;
    /**
     * Validate promotion value based on type
     */
    private validateValue;
    /**
     * Create a new promotion
     */
    createPromotion(input: CreatePromotionInput): Promise<Promotion>;
    /**
     * Get promotion by ID
     */
    getPromotionById(id: string): Promise<Promotion>;
    /**
     * Get all promotions for a store
     */
    getPromotionsByStore(storeId: string, options?: {
        active?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<Promotion[]>;
    /**
     * Get active promotions valid for current date
     */
    getActivePromotions(storeId: string): Promise<Promotion[]>;
    /**
     * Update promotion
     */
    updatePromotion(id: string, input: UpdatePromotionInput): Promise<Promotion>;
    /**
     * Delete promotion
     */
    deletePromotion(id: string): Promise<void>;
    /**
     * Add rule to promotion
     */
    addRuleToPromotion(promotionId: string, type: RuleType, value: string): Promise<PromotionRule>;
    /**
     * Remove rule from promotion
     */
    removeRuleFromPromotion(ruleId: string): Promise<void>;
    /**
     * Add product to promotion
     */
    addProductToPromotion(promotionId: string, productId: string): Promise<PromotionProduct>;
    /**
     * Remove product from promotion
     */
    removeProductFromPromotion(promotionId: string, productId: string): Promise<void>;
    /**
     * Check if promotion applies to a product
     */
    promotionAppliesToProduct(promotionId: string, productId: string, categoryId?: string): Promise<boolean>;
    /**
     * Calculate discount for a product based on promotion
     */
    calculateDiscount(promotion: Promotion, _unitPrice: number, quantity: number, subtotal: number): number;
    /**
     * Apply promotions to cart total
     */
    applyPromotionsToCart(storeId: string, items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        categoryId?: string;
    }>): Promise<{
        subtotal: number;
        discount: number;
        total: number;
        appliedPromotions: Array<{
            promotionId: string;
            discount: number;
        }>;
    }>;
}
export {};
//# sourceMappingURL=index.d.ts.map