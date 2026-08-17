import { PrismaClient, Promotion, PromotionRule, PromotionProduct, RuleType } from '@prisma/client';

export class PromotionRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  /**
   * Create a new promotion
   */
  async create(
    storeId: string,
    data: {
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
  ): Promise<Promotion> {
    return this.prisma.$transaction(async (tx) => {
      const promotion = await tx.promotion.create({
        data: {
          storeId,
          name: data.name,
          description: data.description,
          type: data.type,
          value: data.value,
          minAmount: data.minAmount,
          startDate: data.startDate,
          endDate: data.endDate,
          active: data.active ?? true,
        },
      });

      // Create rules if provided
      if (data.rules && data.rules.length > 0) {
        await tx.promotionRule.createMany({
          data: data.rules.map((rule) => ({
            promotionId: promotion.id,
            type: rule.type,
            value: rule.value,
          })),
        });
      }

      // Create product associations if provided
      if (data.productIds && data.productIds.length > 0) {
        await tx.promotionProduct.createMany({
          data: data.productIds.map((productId) => ({
            promotionId: promotion.id,
            productId,
          })),
        });
      }

      return promotion;
    });
  }

  /**
   * Find promotion by ID
   */
  async findById(id: string): Promise<Promotion | null> {
    return this.prisma.promotion.findUnique({
      where: { id },
      include: {
        rules: true,
        products: true,
      },
    });
  }

  /**
   * Find all promotions for a store
   */
  async findByStore(
    storeId: string,
    options?: {
      active?: boolean;
      limit?: number;
      offset?: number;
    }
  ): Promise<Promotion[]> {
    const where: any = { storeId };

    if (options?.active !== undefined) {
      where.active = options.active;
    }

    return this.prisma.promotion.findMany({
      where,
      include: {
        rules: true,
        products: true,
      },
      take: options?.limit,
      skip: options?.offset,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Find active promotions valid for a specific date
   */
  async findActivePromotions(storeId: string, date: Date = new Date()): Promise<Promotion[]> {
    return this.prisma.promotion.findMany({
      where: {
        storeId,
        active: true,
        startDate: { lte: date },
        endDate: { gte: date },
      },
      include: {
        rules: true,
        products: true,
      },
    });
  }

  /**
   * Update promotion
   */
  async update(
    id: string,
    data: {
      name?: string;
      description?: string;
      type?: 'PERCENTAGE' | 'FIXED';
      value?: number;
      minAmount?: number;
      startDate?: Date;
      endDate?: Date;
      active?: boolean;
    }
  ): Promise<Promotion> {
    return this.prisma.promotion.update({
      where: { id },
      data,
      include: {
        rules: true,
        products: true,
      },
    });
  }

  /**
   * Delete promotion
   */
  async delete(id: string): Promise<Promotion> {
    return this.prisma.promotion.delete({
      where: { id },
    });
  }

  /**
   * Add rule to promotion
   */
  async addRule(promotionId: string, type: RuleType, value: string): Promise<PromotionRule> {
    return this.prisma.promotionRule.create({
      data: {
        promotionId,
        type,
        value,
      },
    });
  }

  /**
   * Remove rule from promotion
   */
  async removeRule(ruleId: string): Promise<PromotionRule> {
    return this.prisma.promotionRule.delete({
      where: { id: ruleId },
    });
  }

  /**
   * Add product to promotion
   */
  async addProduct(promotionId: string, productId: string): Promise<PromotionProduct> {
    return this.prisma.promotionProduct.create({
      data: {
        promotionId,
        productId,
      },
    });
  }

  /**
   * Remove product from promotion
   */
  async removeProduct(promotionId: string, productId: string): Promise<PromotionProduct> {
    return this.prisma.promotionProduct.delete({
      where: {
        promotionId_productId: {
          promotionId,
          productId,
        },
      },
    });
  }

  /**
   * Get promotion rules
   */
  async getRules(promotionId: string): Promise<PromotionRule[]> {
    return this.prisma.promotionRule.findMany({
      where: { promotionId },
    });
  }

  /**
   * Get promotion products
   */
  async getProducts(promotionId: string): Promise<PromotionProduct[]> {
    return this.prisma.promotionProduct.findMany({
      where: { promotionId },
      include: { product: true },
    });
  }
}
