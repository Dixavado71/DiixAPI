import { Request, Response, NextFunction } from 'express';
import { CartService } from '../../services/cart';
import { logger } from '../../utils/logger';

export class CartController {
  private cartService: CartService;

  constructor() {
    this.cartService = new CartService();
  }

  /**
   * Get or create cart for customer
   * GET /api/v1/stores/:storeId/customers/:customerId/cart
   */
  async getCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const customerId = req.params.customerId as string;

      const cart = await this.cartService.getOrCreateCart(storeId, customerId);

      // Calculate totals with promotions
      const totals = await this.cartService.getCartTotals(cart.id);

      res.json({
        ...cart,
        totals,
      });
    } catch (error: any) {
      logger.error({ error: error.message }, 'Error getting cart');
      next(error);
    }
  }

  /**
   * Add item to cart
   * POST /api/v1/stores/:storeId/customers/:customerId/cart/items
   */
  async addItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const customerId = req.params.customerId as string;
      const { productId, quantity } = req.body;

      const cart = await this.cartService.addItem(storeId, customerId, productId, quantity);

      // Calculate totals with promotions
      const totals = await this.cartService.getCartTotals(cart.id);

      logger.info({ cartId: cart.id, productId }, 'Item added to cart');
      res.status(201).json({
        ...cart,
        totals,
      });
    } catch (error: any) {
      if (error.message === 'PRODUCT_NOT_FOUND' || error.message === 'PRODUCT_STORE_MISMATCH') {
        res.status(400).json({ error: error.message });
        return;
      }
      logger.error({ error: error.message }, 'Error adding item to cart');
      next(error);
    }
  }

  /**
   * Update cart item quantity
   * PUT /api/v1/stores/:storeId/customers/:customerId/cart/items/:itemId
   */
  async updateItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const customerId = req.params.customerId as string;
      const itemId = req.params.itemId as string;
      const { quantity } = req.body;

      const cart = await this.cartService.updateItem(storeId, customerId, itemId, quantity);

      // Calculate totals with promotions
      const totals = await this.cartService.getCartTotals(cart.id);

      logger.info({ cartId: cart.id, itemId }, 'Cart item updated');
      res.json({
        ...cart,
        totals,
      });
    } catch (error: any) {
      if (error.message === 'CART_NOT_FOUND') {
        res.status(404).json({ error: error.message });
        return;
      }
      logger.error({ error: error.message }, 'Error updating cart item');
      next(error);
    }
  }

  /**
   * Remove item from cart
   * DELETE /api/v1/stores/:storeId/customers/:customerId/cart/items/:itemId
   */
  async removeItem(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const customerId = req.params.customerId as string;
      const itemId = req.params.itemId as string;

      const cart = await this.cartService.removeItem(storeId, customerId, itemId);

      // Calculate totals with promotions
      const totals = await this.cartService.getCartTotals(cart.id);

      logger.info({ cartId: cart.id, itemId }, 'Item removed from cart');
      res.json({
        ...cart,
        totals,
      });
    } catch (error: any) {
      if (error.message === 'CART_NOT_FOUND') {
        res.status(404).json({ error: error.message });
        return;
      }
      logger.error({ error: error.message }, 'Error removing item from cart');
      next(error);
    }
  }

  /**
   * Clear cart
   * DELETE /api/v1/stores/:storeId/customers/:customerId/cart
   */
  async clearCart(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const customerId = req.params.customerId as string;

      await this.cartService.clearCart(storeId, customerId);

      logger.info({ storeId, customerId }, 'Cart cleared');
      res.status(204).send();
    } catch (error: any) {
      if (error.message === 'CART_NOT_FOUND') {
        res.status(404).json({ error: error.message });
        return;
      }
      logger.error({ error: error.message }, 'Error clearing cart');
      next(error);
    }
  }

  /**
   * Checkout cart
   * POST /api/v1/stores/:storeId/customers/:customerId/cart/checkout
   */
  async checkout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const storeId = req.params.storeId as string;
      const customerId = req.params.customerId as string;
      const { customerAddressId, paymentMethodId } = req.body;

      // Get cart first
      const cart = await this.cartService.getOrCreateCart(storeId, customerId);

      // Process checkout
      const result = await this.cartService.checkout(cart.id, customerAddressId, paymentMethodId);

      logger.info({ cartId: cart.id, result }, 'Cart checkout processed');
      res.status(201).json(result);
    } catch (error: any) {
      if (error.message === 'CART_NOT_FOUND' || error.message === 'CART_NOT_ACTIVE') {
        res.status(400).json({ error: error.message });
        return;
      }
      logger.error({ error: error.message }, 'Error processing checkout');
      next(error);
    }
  }
}
