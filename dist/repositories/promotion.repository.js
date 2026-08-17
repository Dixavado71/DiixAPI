"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionRepository = void 0;
class PromotionRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    /**
     * Create a new promotion
     */
    async create(storeId, data) {
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
    async findById(id) {
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
    async findByStore(storeId, options) {
        const where = { storeId };
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
    async findActivePromotions(storeId, date = new Date()) {
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
    async update(id, data) {
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
    async delete(id) {
        return this.prisma.promotion.delete({
            where: { id },
        });
    }
    /**
     * Add rule to promotion
     */
    async addRule(promotionId, type, value) {
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
    async removeRule(ruleId) {
        return this.prisma.promotionRule.delete({
            where: { id: ruleId },
        });
    }
    /**
     * Add product to promotion
     */
    async addProduct(promotionId, productId) {
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
    async removeProduct(promotionId, productId) {
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
    async getRules(promotionId) {
        return this.prisma.promotionRule.findMany({
            where: { promotionId },
        });
    }
    /**
     * Get promotion products
     */
    async getProducts(promotionId) {
        return this.prisma.promotionProduct.findMany({
            where: { promotionId },
            include: { product: true },
        });
    }
}
exports.PromotionRepository = PromotionRepository;
//# sourceMappingURL=promotion.repository.js.map