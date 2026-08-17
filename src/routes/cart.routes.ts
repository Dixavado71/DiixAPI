import { Router } from 'express';
import { CartController } from '../controllers/cart';

export class CartRoutes {
  private router: Router;
  private controller: CartController;

  constructor() {
    this.router = Router();
    this.controller = new CartController();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    // Get or create cart
    this.router.get('/', (req, res, next) => this.controller.getCart(req, res, next));

    // Add item to cart
    this.router.post('/items', (req, res, next) => this.controller.addItem(req, res, next));

    // Update cart item
    this.router.put('/items/:itemId', (req, res, next) =>
      this.controller.updateItem(req, res, next)
    );

    // Remove item from cart
    this.router.delete('/items/:itemId', (req, res, next) =>
      this.controller.removeItem(req, res, next)
    );

    // Clear cart
    this.router.delete('/', (req, res, next) => this.controller.clearCart(req, res, next));

    // Checkout cart
    this.router.post('/checkout', (req, res, next) => this.controller.checkout(req, res, next));
  }

  getRouter(): Router {
    return this.router;
  }
}
