"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromotionController = void 0;
const promotion_1 = require("../services/promotion");
const promotion_2 = require("../validators/promotion");
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.getLogger)();
class PromotionController {
    promotionService;
    constructor() {
        this.promotionService = new promotion_1.PromotionService();
    }
    /**
     * Create a new promotion
     * POST /api/v1/stores/:storeId/promotions
     */
    async createPromotion(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const body = req.body;
            // Parse and validate input
            const validatedData = promotion_2.createPromotionSchema.parse({
                ...body,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
            });
            const promotion = await this.promotionService.createPromotion({
                ...validatedData,
                storeId,
            });
            logger.info({ promotionId: promotion.id }, 'Promotion created');
            res.status(201).json(promotion);
        }
        catch (error) {
            logger.error({ error: error.message }, 'Error creating promotion');
            next(error);
        }
    }
    /**
     * Get promotion by ID
     * GET /api/v1/stores/:storeId/promotions/:id
     */
    async getPromotion(req, res, next) {
        try {
            const { id } = promotion_2.promotionIdParamsSchema.parse(req.params);
            const promotion = await this.promotionService.getPromotionById(id);
            // Verify promotion belongs to store
            if (promotion.storeId !== req.params.storeId) {
                res.status(404).json({ error: 'PROMOTION_NOT_FOUND' });
                return;
            }
            res.json(promotion);
        }
        catch (error) {
            if (error.message === 'PROMOTION_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            next(error);
        }
    }
    /**
     * Get all promotions for a store
     * GET /api/v1/stores/:storeId/promotions
     */
    async getPromotions(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const query = promotion_2.listPromotionsQuerySchema.parse(req.query);
            const promotions = await this.promotionService.getPromotionsByStore(storeId, {
                active: query.active,
                limit: query.limit,
                offset: query.offset,
            });
            res.json(promotions);
        }
        catch (error) {
            logger.error({ error: error.message }, 'Error fetching promotions');
            next(error);
        }
    }
    /**
     * Get active promotions for a store
     * GET /api/v1/stores/:storeId/promotions/active
     */
    async getActivePromotions(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const promotions = await this.promotionService.getActivePromotions(storeId);
            res.json(promotions);
        }
        catch (error) {
            logger.error({ error: error.message }, 'Error fetching active promotions');
            next(error);
        }
    }
    /**
     * Update promotion
     * PUT /api/v1/stores/:storeId/promotions/:id
     */
    async updatePromotion(req, res, next) {
        try {
            const { id } = promotion_2.promotionIdParamsSchema.parse(req.params);
            const body = req.body;
            // Parse and validate input
            const validatedData = promotion_2.updatePromotionSchema.parse({
                ...body,
                startDate: body.startDate ? new Date(body.startDate) : undefined,
                endDate: body.endDate ? new Date(body.endDate) : undefined,
            });
            const promotion = await this.promotionService.updatePromotion(id, validatedData);
            // Verify promotion belongs to store
            if (promotion.storeId !== req.params.storeId) {
                res.status(404).json({ error: 'PROMOTION_NOT_FOUND' });
                return;
            }
            logger.info({ promotionId: id }, 'Promotion updated');
            res.json(promotion);
        }
        catch (error) {
            if (error.message === 'PROMOTION_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            logger.error({ error: error.message }, 'Error updating promotion');
            next(error);
        }
    }
    /**
     * Delete promotion
     * DELETE /api/v1/stores/:storeId/promotions/:id
     */
    async deletePromotion(req, res, next) {
        try {
            const { id } = promotion_2.promotionIdParamsSchema.parse(req.params);
            const promotion = await this.promotionService.getPromotionById(id);
            // Verify promotion belongs to store
            if (promotion.storeId !== req.params.storeId) {
                res.status(404).json({ error: 'PROMOTION_NOT_FOUND' });
                return;
            }
            await this.promotionService.deletePromotion(id);
            logger.info({ promotionId: id }, 'Promotion deleted');
            res.status(204).send();
        }
        catch (error) {
            if (error.message === 'PROMOTION_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            logger.error({ error: error.message }, 'Error deleting promotion');
            next(error);
        }
    }
    /**
     * Add rule to promotion
     * POST /api/v1/stores/:storeId/promotions/:id/rules
     */
    async addRule(req, res, next) {
        try {
            const { id } = promotion_2.promotionIdParamsSchema.parse(req.params);
            const body = req.body;
            const validatedData = promotion_2.addPromotionRuleSchema.parse(body);
            const rule = await this.promotionService.addRuleToPromotion(id, validatedData.type, validatedData.value);
            logger.info({ promotionId: id, ruleId: rule.id }, 'Rule added to promotion');
            res.status(201).json(rule);
        }
        catch (error) {
            if (error.message === 'PROMOTION_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            logger.error({ error: error.message }, 'Error adding rule to promotion');
            next(error);
        }
    }
    /**
     * Remove rule from promotion
     * DELETE /api/v1/stores/:storeId/promotions/:id/rules/:ruleId
     */
    async removeRule(req, res, next) {
        try {
            const { ruleId } = req.params;
            await this.promotionService.removeRuleFromPromotion(ruleId);
            logger.info({ ruleId }, 'Rule removed from promotion');
            res.status(204).send();
        }
        catch (error) {
            logger.error({ error: error.message }, 'Error removing rule from promotion');
            next(error);
        }
    }
    /**
     * Add product to promotion
     * POST /api/v1/stores/:storeId/promotions/:id/products
     */
    async addProduct(req, res, next) {
        try {
            const { id } = promotion_2.promotionIdParamsSchema.parse(req.params);
            const body = req.body;
            const validatedData = promotion_2.addPromotionProductSchema.parse(body);
            const promotionProduct = await this.promotionService.addProductToPromotion(id, validatedData.productId);
            logger.info({ promotionId: id, productId: validatedData.productId }, 'Product added to promotion');
            res.status(201).json(promotionProduct);
        }
        catch (error) {
            if (error.message === 'PROMOTION_NOT_FOUND' || error.message === 'PRODUCT_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            logger.error({ error: error.message }, 'Error adding product to promotion');
            next(error);
        }
    }
    /**
     * Remove product from promotion
     * DELETE /api/v1/stores/:storeId/promotions/:id/products/:productId
     */
    async removeProduct(req, res, next) {
        try {
            const { id, productId } = req.params;
            await this.promotionService.removeProductFromPromotion(id, productId);
            logger.info({ promotionId: id, productId }, 'Product removed from promotion');
            res.status(204).send();
        }
        catch (error) {
            logger.error({ error: error.message }, 'Error removing product from promotion');
            next(error);
        }
    }
}
exports.PromotionController = PromotionController;
//# sourceMappingURL=promotion.controller.js.map