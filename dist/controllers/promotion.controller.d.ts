import { Request, Response, NextFunction } from 'express';
export declare class PromotionController {
    private promotionService;
    constructor();
    /**
     * Create a new promotion
     * POST /api/v1/stores/:storeId/promotions
     */
    createPromotion(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get promotion by ID
     * GET /api/v1/stores/:storeId/promotions/:id
     */
    getPromotion(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get all promotions for a store
     * GET /api/v1/stores/:storeId/promotions
     */
    getPromotions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Get active promotions for a store
     * GET /api/v1/stores/:storeId/promotions/active
     */
    getActivePromotions(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Update promotion
     * PUT /api/v1/stores/:storeId/promotions/:id
     */
    updatePromotion(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Delete promotion
     * DELETE /api/v1/stores/:storeId/promotions/:id
     */
    deletePromotion(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add rule to promotion
     * POST /api/v1/stores/:storeId/promotions/:id/rules
     */
    addRule(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove rule from promotion
     * DELETE /api/v1/stores/:storeId/promotions/:id/rules/:ruleId
     */
    removeRule(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Add product to promotion
     * POST /api/v1/stores/:storeId/promotions/:id/products
     */
    addProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
    /**
     * Remove product from promotion
     * DELETE /api/v1/stores/:storeId/promotions/:id/products/:productId
     */
    removeProduct(req: Request, res: Response, next: NextFunction): Promise<void>;
}
//# sourceMappingURL=promotion.controller.d.ts.map