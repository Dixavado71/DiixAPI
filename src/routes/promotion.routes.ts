import { Router } from 'express';
import { PromotionController } from '../controllers/promotion.controller';

export class PromotionRoutes {
  private router: Router;
  private controller: PromotionController;

  constructor() {
    this.router = Router();
    this.controller = new PromotionController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Create promotion
    this.router.post('/', (req, res, next) => this.controller.createPromotion(req, res, next));

    // Get all promotions for a store
    this.router.get('/', (req, res, next) => this.controller.getPromotions(req, res, next));

    // Get active promotions
    this.router.get('/active', (req, res, next) =>
      this.controller.getActivePromotions(req, res, next)
    );

    // Get promotion by ID
    this.router.get('/:id', (req, res, next) => this.controller.getPromotion(req, res, next));

    // Update promotion
    this.router.put('/:id', (req, res, next) => this.controller.updatePromotion(req, res, next));

    // Delete promotion
    this.router.delete('/:id', (req, res, next) => this.controller.deletePromotion(req, res, next));

    // Add rule to promotion
    this.router.post('/:id/rules', (req, res, next) => this.controller.addRule(req, res, next));

    // Remove rule from promotion
    this.router.delete('/:id/rules/:ruleId', (req, res, next) =>
      this.controller.removeRule(req, res, next)
    );

    // Add product to promotion
    this.router.post('/:id/products', (req, res, next) =>
      this.controller.addProduct(req, res, next)
    );

    // Remove product from promotion
    this.router.delete('/:id/products/:productId', (req, res, next) =>
      this.controller.removeProduct(req, res, next)
    );
  }

  getRouter(): Router {
    return this.router;
  }
}
