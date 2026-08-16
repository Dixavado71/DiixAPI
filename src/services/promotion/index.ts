import { Promotion, PromotionRule, PromotionProduct, RuleType } from '@prisma/client';
import { PromotionRepository } from '../../repositories/promotion.repository';
import { ProductRepository } from '../../repositories/product.repository';
import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';

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
  rules?: Array<{ type: RuleType; value: string }>;
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

export class PromotionService {
  private promotionRepository: PromotionRepository;
  private productRepository: ProductRepository;

  constructor() {
    this.promotionRepository = new PromotionRepository(prisma);
    this.productRepository = new ProductRepository(prisma);
  }

  /**
   * Validate promotion date range
   */
  private validateDateRange(startDate: Date, endDate: Date): void {
    if (endDate <= startDate) {
      throw new Error('END_DATE_MUST_BE_AFTER_START_DATE');
    }

    const now = new Date();
    if (startDate < now) {
      logger.warn({ startDate, now }, 'Promotion start date is in the past');
    }
  }

  /**
   * Validate promotion value based on type
   */
  private validateValue(type: 'PERCENTAGE' | 'FIXED', value: number): void {
    if (type === 'PERCENTAGE') {
      if (value < 0 || value > 100) {
        throw new Error('PERCENTAGE_VALUE_MUST_BE_BETWEEN_0_AND_100');
      }
    } else if (value < 0) {
      throw new Error('FIXED_VALUE_MUST_BE_NON_NEGATIVE');
    }
  }

  /**
   * Create a new promotion
   */
  async createPromotion(input: CreatePromotionInput): Promise<Promotion> {
    const { storeId, name, type, value, startDate, endDate, minAmount, rules, productIds } = input;

    const logContext = {
      storeId,
      name,
      type,
    };

    logger.info(logContext, 'Creating promotion');

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

    logger.info({ promotionId: promotion.id }, 'Promotion created successfully');

    return promotion;
  }

  /**
   * Get promotion by ID
   */
  async getPromotionById(id: string): Promise<Promotion> {
    const promotion = await this.promotionRepository.findById(id);

    if (!promotion) {
      throw new Error('PROMOTION_NOT_FOUND');
    }

    return promotion;
  }

  /**
   * Get all promotions for a store
   */
  async getPromotionsByStore(
    storeId: string,
    options?: {
      active?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<Promotion[]> {
    return this.promotionRepository.findByStore(storeId, options);
  }

  /**
   * Get active promotions valid for current date
   */
  async getActivePromotions(storeId: string): Promise<Promotion[]> {
    return this.promotionRepository.findActivePromotions(storeId);
  }

  /**
   * Update promotion
   */
  async updatePromotion(id: string, input: UpdatePromotionInput): Promise<Promotion> {
    // Verify promotion exists
    const existingPromotion = await this.getPromotionById(id);

    // Validate date range if both dates are provided
    if (input.startDate && input.endDate) {
      this.validateDateRange(input.startDate, input.endDate);
    }

    // Validate value if provided
    if (input.value && input.type) {
      this.validateValue(input.type, input.value);
    } else if (input.value && !input.type) {
      this.validateValue(existingPromotion.type as 'PERCENTAGE' | 'FIXED', input.value);
    }

    const promotion = await this.promotionRepository.update(id, input);

    logger.info({ promotionId: id }, 'Promotion updated successfully');

    return promotion;
  }

  /**
   * Delete promotion
   */
  async deletePromotion(id: string): Promise<void> {
    await this.getPromotionById(id); // Verify exists
    await this.promotionRepository.delete(id);

    logger.info({ promotionId: id }, 'Promotion deleted successfully');
  }

  /**
   * Add rule to promotion
   */
  async addRuleToPromotion(
    promotionId: string,
    type: RuleType,
    value: string
  ): Promise<PromotionRule> {
    await this.getPromotionById(promotionId); // Verify exists

    const rule = await this.promotionRepository.addRule(promotionId, type, value);

    logger.info({ promotionId, ruleId: rule.id, type }, 'Rule added to promotion');

    return rule;
  }

  /**
   * Remove rule from promotion
   */
  async removeRuleFromPromotion(ruleId: string): Promise<void> {
    await this.promotionRepository.removeRule(ruleId);

    logger.info({ ruleId }, 'Rule removed from promotion');
  }

  /**
   * Add product to promotion
   */
  async addProductToPromotion(promotionId: string, productId: string): Promise<PromotionProduct> {
    await this.getPromotionById(promotionId); // Verify exists

    const product = await this.productRepository.findById(productId);
    if (!product) {
      throw new Error('PRODUCT_NOT_FOUND');
    }

    const promotionProduct = await this.promotionRepository.addProduct(promotionId, productId);

    logger.info({ promotionId, productId }, 'Product added to promotion');

    return promotionProduct;
  }

  /**
   * Remove product from promotion
   */
  async removeProductFromPromotion(promotionId: string, productId: string): Promise<void> {
    await this.getPromotionById(promotionId); // Verify exists
    await this.promotionRepository.removeProduct(promotionId, productId);

    logger.info({ promotionId, productId }, 'Product removed from promotion');
  }

  /**
   * Check if promotion applies to a product
   */
  async promotionAppliesToProduct(
    promotionId: string,
    productId: string,
    categoryId?: string
  ): Promise<boolean> {
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
  calculateDiscount(
    promotion: Promotion,
    _unitPrice: number,
    quantity: number,
    subtotal: number
  ): number {
    // Check minimum amount requirement
    if (promotion.minAmount && subtotal < Number(promotion.minAmount)) {
      return 0;
    }

    let discount = 0;

    if (promotion.type === 'PERCENTAGE') {
      discount = (Number(promotion.value) / 100) * subtotal;
    } else {
      // FIXED type - apply fixed discount per item
      discount = Number(promotion.value) * quantity;
    }

    // Ensure discount doesn't exceed subtotal
    return Math.min(discount, subtotal);
  }

  /**
   * Apply promotions to cart total
   */
  async applyPromotionsToCart(
    storeId: string,
    items: Array<{ productId: string; quantity: number; unitPrice: number; categoryId?: string }>
  ): Promise<{
    subtotal: number;
    discount: number;
    total: number;
    appliedPromotions: Array<{ promotionId: string; discount: number }>;
  }> {
    const activePromotions = await this.getActivePromotions(storeId);

    let subtotal = 0;
    let totalDiscount = 0;
    const appliedPromotions: Array<{ promotionId: string; discount: number }> = [];

    // Calculate subtotal
    for (const item of items) {
      subtotal += item.unitPrice * item.quantity;
    }

    // Find best applicable promotion for each item
    for (const item of items) {
      let bestDiscount = 0;

      for (const promotion of activePromotions) {
        const applies = await this.promotionAppliesToProduct(
          promotion.id,
          item.productId,
          item.categoryId
        );

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
