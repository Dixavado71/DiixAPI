import { PrismaClient, Promotion, PromotionRule, PromotionProduct, RuleType } from '@prisma/client';
export declare class PromotionRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    /**
     * Create a new promotion
     */
    create(storeId: string, data: {
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
    }): Promise<Promotion>;
    /**
     * Find promotion by ID
     */
    findById(id: string): Promise<Promotion | null>;
    /**
     * Find all promotions for a store
     */
    findByStore(storeId: string, options?: {
        active?: boolean;
        limit?: number;
        offset?: number;
    }): Promise<Promotion[]>;
    /**
     * Find active promotions valid for a specific date
     */
    findActivePromotions(storeId: string, date?: Date): Promise<Promotion[]>;
    /**
     * Update promotion
     */
    update(id: string, data: {
        name?: string;
        description?: string;
        type?: 'PERCENTAGE' | 'FIXED';
        value?: number;
        minAmount?: number;
        startDate?: Date;
        endDate?: Date;
        active?: boolean;
    }): Promise<Promotion>;
    /**
     * Delete promotion
     */
    delete(id: string): Promise<Promotion>;
    /**
     * Add rule to promotion
     */
    addRule(promotionId: string, type: RuleType, value: string): Promise<PromotionRule>;
    /**
     * Remove rule from promotion
     */
    removeRule(ruleId: string): Promise<PromotionRule>;
    /**
     * Add product to promotion
     */
    addProduct(promotionId: string, productId: string): Promise<PromotionProduct>;
    /**
     * Remove product from promotion
     */
    removeProduct(promotionId: string, productId: string): Promise<PromotionProduct>;
    /**
     * Get promotion rules
     */
    getRules(promotionId: string): Promise<PromotionRule[]>;
    /**
     * Get promotion products
     */
    getProducts(promotionId: string): Promise<PromotionProduct[]>;
}
//# sourceMappingURL=promotion.repository.d.ts.map