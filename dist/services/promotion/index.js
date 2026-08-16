"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionService = void 0;
const promotion_repository_1 = require("../../repositories/promotion.repository");
const product_repository_1 = require("../../repositories/product.repository");
const database_1 = require("../../config/database");
const logger_1 = require("../../utils/logger");
class PromotionService {
    promotionRepository;
    productRepository;
    constructor() {
        this.promotionRepository = new promotion_repository_1.PromotionRepository(database_1.prisma);
        this.productRepository = new product_repository_1.ProductRepository(database_1.prisma);
    }
    /**
     * Validate promotion date range
     */
    validateDateRange(startDate, endDate) {
        if (endDate <= startDate) {
            throw new Error('END_DATE_MUST_BE_AFTER_START_DATE');
        }
        const now = new Date();
        if (startDate < now) {
            logger_1.logger.warn({ startDate, now }, 'Promotion start date is in the past');
        }
    }
    /**
     * Validate promotion value based on type
     */
    validateValue(type, value) {
        if (type === 'PERCENTAGE') {
            if (value < 0 || value > 100) {
                throw new Error('PERCENTAGE_VALUE_MUST_BE_BETWEEN_0_AND_100');
            }
        }
        else if (value < 0) {
            throw new Error('FIXED_VALUE_MUST_BE_NON_NEGATIVE');
        }
    }
    /**
     * Create a new promotion
     */
    async createPromotion(input) {
        const { storeId, name, type, value, startDate, endDate, minAmount, rules, productIds } = input;
        const logContext = {
            storeId,
            name,
            type,
        };
        logger_1.logger.info(logContext, 'Creating promotion');
        // Validate date range
        this.validateDateRange(startDate, endDate);
        // Validate value
        this.validateValue(type, value);
        // Validate products exist and belong to store if provided
        if (productIds && productIds.length > 0) {
            for (const productId of productIds) {
                const product = await this.productRepository.findById(productId);
                if (!product) {
                    throw new Error(`PRODUCT_NOT_FOUND: ${productId}`);
                }
                if (product.storeId !== storeId) {
                    throw new Error('PRODUCT_STORE_MISMATCH');
                }
            }
        }
        const promotion = await this.promotionRepository.create(storeId, {
            name,
            type,
            value,
            minAmount,
            startDate,
            endDate,
            active: input.active,
            rules,
            productIds,
        });
        logger_1.logger.info({ promotionId: promotion.id }, 'Promotion created successfully');
        return promotion;
    }
    /**
     * Get promotion by ID
     */
    async getPromotionById(id) {
        const promotion = await this.promotionRepository.findById(id);
        if (!promotion) {
            throw new Error('PROMOTION_NOT_FOUND');
        }
        return promotion;
    }
    /**
     * Get all promotions for a store
     */
    async getPromotionsByStore(storeId, options) {
        return this.promotionRepository.findByStore(storeId, options);
    }
    /**
     * Get active promotions valid for current date
     */
    async getActivePromotions(storeId) {
        return this.promotionRepository.findActivePromotions(storeId);
    }
    /**
     * Update promotion
     */
    async updatePromotion(id, input) {
        // Verify promotion exists
        const existingPromotion = await this.getPromotionById(id);
        // Validate date range if both dates are provided
        if (input.startDate && input.endDate) {
            this.validateDateRange(input.startDate, input.endDate);
        }
        // Validate value if provided
        if (input.value && input.type) {
            this.validateValue(input.type, input.value);
        }
        else if (input.value && !input.type) {
            this.validateValue(existingPromotion.type, input.value);
        }
        const promotion = await this.promotionRepository.update(id, input);
        logger_1.logger.info({ promotionId: id }, 'Promotion updated successfully');
        return promotion;
    }
    /**
     * Delete promotion
     */
    async deletePromotion(id) {
        await this.getPromotionById(id); // Verify exists
        await this.promotionRepository.delete(id);
        logger_1.logger.info({ promotionId: id }, 'Promotion deleted successfully');
    }
    /**
     * Add rule to promotion
     */
    async addRuleToPromotion(promotionId, type, value) {
        await this.getPromotionById(promotionId); // Verify exists
        const rule = await this.promotionRepository.addRule(promotionId, type, value);
        logger_1.logger.info({ promotionId, ruleId: rule.id, type }, 'Rule added to promotion');
        return rule;
    }
    /**
     * Remove rule from promotion
     */
    async removeRuleFromPromotion(ruleId) {
        await this.promotionRepository.removeRule(ruleId);
        logger_1.logger.info({ ruleId }, 'Rule removed from promotion');
    }
    /**
     * Add product to promotion
     */
    async addProductToPromotion(promotionId, productId) {
        await this.getPromotionById(promotionId); // Verify exists
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('PRODUCT_NOT_FOUND');
        }
        const promotionProduct = await this.promotionRepository.addProduct(promotionId, productId);
        logger_1.logger.info({ promotionId, productId }, 'Product added to promotion');
        return promotionProduct;
    }
    /**
     * Remove product from promotion
     */
    async removeProductFromPromotion(promotionId, productId) {
        await this.getPromotionById(promotionId); // Verify exists
        await this.promotionRepository.removeProduct(promotionId, productId);
        logger_1.logger.info({ promotionId, productId }, 'Product removed from promotion');
    }
    /**
     * Check if promotion applies to a product
     */
    async promotionAppliesToProduct(promotionId, productId, categoryId) {
        const promotion = await this.getPromotionById(promotionId);
        // Check if promotion is active
        if (!promotion.active) {
            return false;
        }
        // Check date validity
        const now = new Date();
        if (now < promotion.startDate || now > promotion.endDate) {
            return false;
        }
        const rules = await this.promotionRepository.getRules(promotionId);
        const products = await this.promotionRepository.getProducts(promotionId);
        // If there are specific product rules, check if product matches
        const productRules = rules.filter((r) => r.type === 'PRODUCT');
        if (productRules.length > 0) {
            const hasProductMatch = products.some((p) => p.productId === productId);
            if (!hasProductMatch) {
                return false;
            }
        }
        // If there are category rules, check if product's category matches
        const categoryRules = rules.filter((r) => r.type === 'CATEGORY');
        if (categoryRules.length > 0 && categoryId) {
            const hasCategoryMatch = categoryRules.some((r) => r.value === categoryId);
            if (!hasCategoryMatch) {
                return false;
            }
        }
        return true;
    }
    /**
     * Calculate discount for a product based on promotion
     */
    calculateDiscount(promotion, _unitPrice, quantity, subtotal) {
        // Check minimum amount requirement
        if (promotion.minAmount && subtotal < Number(promotion.minAmount)) {
            return 0;
        }
        let discount = 0;
        if (promotion.type === 'PERCENTAGE') {
            discount = (Number(promotion.value) / 100) * subtotal;
        }
        else {
            // FIXED type - apply fixed discount per item
            discount = Number(promotion.value) * quantity;
        }
        // Ensure discount doesn't exceed subtotal
        return Math.min(discount, subtotal);
    }
    /**
     * Apply promotions to cart total
     */
    async applyPromotionsToCart(storeId, items) {
        const activePromotions = await this.getActivePromotions(storeId);
        let subtotal = 0;
        let totalDiscount = 0;
        const appliedPromotions = [];
        // Calculate subtotal
        for (const item of items) {
            subtotal += item.unitPrice * item.quantity;
        }
        // Find best applicable promotion for each item
        for (const item of items) {
            let bestDiscount = 0;
            for (const promotion of activePromotions) {
                const applies = await this.promotionAppliesToProduct(promotion.id, item.productId, item.categoryId);
                if (applies) {
                    const itemSubtotal = item.unitPrice * item.quantity;
                    const discount = this.calculateDiscount(promotion, item.unitPrice, item.quantity, itemSubtotal);
                    if (discount > bestDiscount) {
                        bestDiscount = discount;
                    }
                }
            }
            totalDiscount += bestDiscount;
        }
        // For now, we'll just track that promotions were applied
        // In a more sophisticated system, you'd track which promotion gave which discount
        if (totalDiscount > 0) {
            appliedPromotions.push({
                promotionId: 'multiple',
                discount: totalDiscount,
            });
        }
        const total = subtotal - totalDiscount;
        return {
            subtotal,
            discount: totalDiscount,
            total,
            appliedPromotions,
        };
    }
}
exports.PromotionService = PromotionService;
//# sourceMappingURL=index.js.map