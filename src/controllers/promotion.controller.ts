import { Request, Response, NextFunction } from 'express';
import { PromotionService } from '../services/promotion';
import {
  createPromotionSchema,
  updatePromotionSchema,
  addPromotionRuleSchema,
  addPromotionProductSchema,
  listPromotionsQuerySchema,
  promotionIdParamsSchema,
} from '../validators/promotion';
import { logger } from '../utils/logger';

const loggerInstance = logger;

export class PromotionController {
  private promotionService: PromotionService;

  constructor() {
    this.promotionService = new PromotionService();
  }

  /**
   * Create a new promotion
   * POST /api/v1/stores/:storeId/promotions
   */
  async createPromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const body = req.body;

      // Parse and validate input
      const validatedData = createPromotionSchema.parse({
        ...body,
        startDate: body.startDate ? new Date(body.startDate) : undefined,
        endDate: body.endDate ? new Date(body.endDate) : undefined,
      });

      const promotion = await this.promotionService.createPromotion({
        ...validatedData,
        storeId,
      });

      loggerInstance.info({ promotionId: promotion.id }, 'Promotion created');
      res.status(201).json(promotion);
    } catch (error: any) {
      loggerInstance.error({ error: error.message }, 'Error creating promotion');
      next(error);
    }
  }

  /**
   * Get promotion by ID
   * GET /api/v1/stores/:storeId/promotions/:id
   */
  async getPromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = promotionIdParamsSchema.parse(req.params);

      const promotion = await this.promotionService.getPromotionById(id);

      // Verify promotion belongs to store
      if (promotion.storeId !== req.params.storeId) {
        res.status(404).json({ error: 'PROMOTION_NOT_FOUND' });
        return;
      }

      res.json(promotion);
    } catch (error: any) {
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
  async getPromotions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const query = listPromotionsQuerySchema.parse(req.query);

      const promotions = await this.promotionService.getPromotionsByStore(storeId, {
        active: query.active,
        limit: query.limit,
        offset: query.offset,
      });

      res.json(promotions);
    } catch (error: any) {
      loggerInstance.error({ error: error.message }, 'Error fetching promotions');
      next(error);
    }
  }

  /**
   * Get active promotions for a store
   * GET /api/v1/stores/:storeId/promotions/active
   */
  async getActivePromotions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;

      const promotions = await this.promotionService.getActivePromotions(storeId);

      res.json(promotions);
    } catch (error: any) {
      loggerInstance.error({ error: error.message }, 'Error fetching active promotions');
      next(error);
    }
  }

  /**
   * Update promotion
   * PUT /api/v1/stores/:storeId/promotions/:id
   */
  async updatePromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = promotionIdParamsSchema.parse(req.params);
      const body = req.body;

      // Parse and validate input
      const validatedData = updatePromotionSchema.parse({
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

      loggerInstance.info({ promotionId: id }, 'Promotion updated');
      res.json(promotion);
    } catch (error: any) {
      if (error.message === 'PROMOTION_NOT_FOUND') {
        res.status(404).json({ error: error.message });
        return;
      }
      loggerInstance.error({ error: error.message }, 'Error updating promotion');
      next(error);
    }
  }

  /**
   * Delete promotion
   * DELETE /api/v1/stores/:storeId/promotions/:id
   */
  async deletePromotion(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = promotionIdParamsSchema.parse(req.params);

      const promotion = await this.promotionService.getPromotionById(id);

      // Verify promotion belongs to store
      if (promotion.storeId !== req.params.storeId) {
        res.status(404).json({ error: 'PROMOTION_NOT_FOUND' });
        return;
      }

      await this.promotionService.deletePromotion(id);

      loggerInstance.info({ promotionId: id }, 'Promotion deleted');
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'PROMOTION_NOT_FOUND') {
        res.status(404).json({ error: error.message });
        return;
      }
      loggerInstance.error({ error: error.message }, 'Error deleting promotion');
      next(error);
    }
  }

  /**
   * Add rule to promotion
   * POST /api/v1/stores/:storeId/promotions/:id/rules
   */
  async addRule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = promotionIdParamsSchema.parse(req.params);
      const body = req.body;

      const validatedData = addPromotionRuleSchema.parse(body);

      const rule = await this.promotionService.addRuleToPromotion(
        id,
        validatedData.type,
        validatedData.value
      );

      loggerInstance.info({ promotionId: id, ruleId: rule.id }, 'Rule added to promotion');
      res.status(201).json(rule);
    } catch (error: any) {
      if (error.message === 'PROMOTION_NOT_FOUND') {
        res.status(404).json({ error: error.message });
        return;
      }
      loggerInstance.error({ error: error.message }, 'Error adding rule to promotion');
      next(error);
    }
  }

  /**
   * Remove rule from promotion
   * DELETE /api/v1/stores/:storeId/promotions/:id/rules/:ruleId
   */
  async removeRule(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { ruleId } = req.params;

      await this.promotionService.removeRuleFromPromotion(ruleId as string);

      loggerInstance.info({ ruleId }, 'Rule removed from promotion');
      res.status(204).send();
    } catch (error: any) {
      loggerInstance.error({ error: error.message }, 'Error removing rule from promotion');
      next(error);
    }
  }

  /**
   * Add product to promotion
   * POST /api/v1/stores/:storeId/promotions/:id/products
   */
  async addProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = promotionIdParamsSchema.parse(req.params);
      const body = req.body;

      const validatedData = addPromotionProductSchema.parse(body);

      const promotionProduct = await this.promotionService.addProductToPromotion(
        id,
        validatedData.productId
      );

      loggerInstance.info({ promotionId: id, productId: validatedData.productId }, 'Product added to promotion');
      res.status(201).json(promotionProduct);
    } catch (error: any) {
      if (error.message === 'PROMOTION_NOT_FOUND' || error.message === 'PRODUCT_NOT_FOUND') {
        res.status(404).json({ error: error.message });
        return;
      }
      loggerInstance.error({ error: error.message }, 'Error adding product to promotion');
      next(error);
    }
  }

  /**
   * Remove product from promotion
   * DELETE /api/v1/stores/:storeId/promotions/:id/products/:productId
   */
  async removeProduct(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id, productId } = req.params;

      await this.promotionService.removeProductFromPromotion(id as string, productId as string);

      loggerInstance.info({ promotionId: id, productId }, 'Product removed from promotion');
      res.status(204).send();
    } catch (error: any) {
      loggerInstance.error({ error: error.message }, 'Error removing product from promotion');
      next(error);
    }
  }
}
