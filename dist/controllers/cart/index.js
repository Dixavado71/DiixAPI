"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartController = void 0;
const cart_1 = require("../../services/cart");
const logger_1 = require("../../utils/logger");
class CartController {
    cartService;
    constructor() {
        this.cartService = new cart_1.CartService();
    }
    /**
     * Get or create cart for customer
     * GET /api/v1/stores/:storeId/customers/:customerId/cart
     */
    async getCart(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const customerId = req.params.customerId;
            const cart = await this.cartService.getOrCreateCart(storeId, customerId);
            // Calculate totals with promotions
            const totals = await this.cartService.getCartTotals(cart.id);
            res.json({
                ...cart,
                totals,
            });
        }
        catch (error) {
            logger_1.logger.error({ error: error.message }, 'Error getting cart');
            next(error);
        }
    }
    /**
     * Add item to cart
     * POST /api/v1/stores/:storeId/customers/:customerId/cart/items
     */
    async addItem(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const customerId = req.params.customerId;
            const { productId, quantity } = req.body;
            const cart = await this.cartService.addItem(storeId, customerId, productId, quantity);
            // Calculate totals with promotions
            const totals = await this.cartService.getCartTotals(cart.id);
            logger_1.logger.info({ cartId: cart.id, productId }, 'Item added to cart');
            res.status(201).json({
                ...cart,
                totals,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'PRODUCT_NOT_FOUND') {
                res.status(400).json({ error: error.message });
                return;
            }
            logger_1.logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Error adding item to cart');
            next(error);
        }
    }
    /**
     * Update cart item quantity
     * PUT /api/v1/stores/:storeId/customers/:customerId/cart/items/:itemId
     */
    async updateItem(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const customerId = req.params.customerId;
            const itemId = req.params.itemId;
            const { quantity } = req.body;
            const cart = await this.cartService.updateItem(storeId, customerId, itemId, quantity);
            // Calculate totals with promotions
            const totals = await this.cartService.getCartTotals(cart.id);
            logger_1.logger.info({ cartId: cart.id, itemId }, 'Cart item updated');
            res.json({
                ...cart,
                totals,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'CART_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            logger_1.logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Error updating cart item');
            next(error);
        }
    }
    /**
     * Remove item from cart
     * DELETE /api/v1/stores/:storeId/customers/:customerId/cart/items/:itemId
     */
    async removeItem(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const customerId = req.params.customerId;
            const itemId = req.params.itemId;
            const cart = await this.cartService.removeItem(storeId, customerId, itemId);
            // Calculate totals with promotions
            const totals = await this.cartService.getCartTotals(cart.id);
            logger_1.logger.info({ cartId: cart.id, itemId }, 'Item removed from cart');
            res.json({
                ...cart,
                totals,
            });
        }
        catch (error) {
            if (error instanceof Error && error.message === 'CART_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            logger_1.logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Error removing item from cart');
            next(error);
        }
    }
    /**
     * Clear cart
     * DELETE /api/v1/stores/:storeId/customers/:customerId/cart
     */
    async clearCart(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const customerId = req.params.customerId;
            await this.cartService.clearCart(storeId, customerId);
            logger_1.logger.info({ storeId, customerId }, 'Cart cleared');
            res.status(204).send();
        }
        catch (error) {
            if (error instanceof Error && error.message === 'CART_NOT_FOUND') {
                res.status(404).json({ error: error.message });
                return;
            }
            logger_1.logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Error clearing cart');
            next(error);
        }
    }
    /**
     * Checkout cart
     * POST /api/v1/stores/:storeId/customers/:customerId/cart/checkout
     */
    async checkout(req, res, next) {
        try {
            const storeId = req.params.storeId;
            const customerId = req.params.customerId;
            const { customerAddressId, paymentMethodId } = req.body;
            // Get cart first
            const cart = await this.cartService.getOrCreateCart(storeId, customerId);
            // Process checkout
            const result = await this.cartService.checkout(cart.id, customerAddressId, paymentMethodId);
            logger_1.logger.info({ cartId: cart.id, result }, 'Cart checkout processed');
            res.status(201).json(result);
        }
        catch (error) {
            if (error instanceof Error && (error.message === 'CART_NOT_FOUND' || error.message === 'CART_NOT_ACTIVE')) {
                res.status(400).json({ error: error.message });
                return;
            }
            logger_1.logger.error({ error: error instanceof Error ? error.message : 'Unknown error' }, 'Error processing checkout');
            next(error);
        }
    }
}
exports.CartController = CartController;
//# sourceMappingURL=index.js.map