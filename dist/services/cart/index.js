"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const cart_repository_1 = require("../../repositories/cart.repository");
const product_repository_1 = require("../../repositories/product.repository");
const promotion_1 = require("../promotion");
const database_1 = require("../../config/database");
const logger_1 = require("../../utils/logger");
class CartService {
    cartRepository;
    productRepository;
    promotionService;
    constructor() {
        this.cartRepository = new cart_repository_1.CartRepository(database_1.prisma);
        this.productRepository = new product_repository_1.ProductRepository(database_1.prisma);
        this.promotionService = new promotion_1.PromotionService();
    }
    /**
     * Get or create active cart for customer
     */
    async getOrCreateCart(storeId, customerId) {
        const cart = await this.cartRepository.getOrCreateCart(storeId, customerId);
        return cart;
    }
    /**
     * Add item to cart
     */
    async addItem(storeId, customerId, productId, quantity) {
        const logContext = {
            storeId,
            customerId,
            productId,
            quantity,
        };
        logger_1.logger.info(logContext, 'Adding item to cart');
        // Verify product exists and belongs to store
        const product = await this.productRepository.findById(productId);
        if (!product) {
            throw new Error('PRODUCT_NOT_FOUND');
        }
        if (product.storeId !== storeId) {
            throw new Error('PRODUCT_STORE_MISMATCH');
        }
        // Get or create cart
        const cart = await this.cartRepository.getOrCreateCart(storeId, customerId);
        // Add item
        await this.cartRepository.addItem(cart.id, productId, quantity);
        // Return updated cart
        const updatedCart = await this.cartRepository.findById(cart.id);
        logger_1.logger.info({ cartId: cart.id }, 'Item added to cart');
        return updatedCart;
    }
    /**
     * Update cart item quantity
     */
    async updateItem(storeId, customerId, itemId, quantity) {
        const logContext = {
            storeId,
            customerId,
            itemId,
            quantity,
        };
        logger_1.logger.info(logContext, 'Updating cart item');
        // Verify cart belongs to customer and store
        const cart = await this.cartRepository.findActiveCart(storeId, customerId);
        if (!cart) {
            throw new Error('CART_NOT_FOUND');
        }
        // Update item
        await this.cartRepository.updateItem(itemId, quantity);
        // Return updated cart
        const updatedCart = await this.cartRepository.findById(cart.id);
        logger_1.logger.info({ cartId: cart.id, itemId }, 'Cart item updated');
        return updatedCart;
    }
    /**
     * Remove item from cart
     */
    async removeItem(storeId, customerId, itemId) {
        const logContext = {
            storeId,
            customerId,
            itemId,
        };
        logger_1.logger.info(logContext, 'Removing item from cart');
        // Verify cart belongs to customer and store
        const cart = await this.cartRepository.findActiveCart(storeId, customerId);
        if (!cart) {
            throw new Error('CART_NOT_FOUND');
        }
        // Remove item
        await this.cartRepository.removeItem(itemId);
        // Return updated cart
        const updatedCart = await this.cartRepository.findById(cart.id);
        logger_1.logger.info({ cartId: cart.id, itemId }, 'Item removed from cart');
        return updatedCart;
    }
    /**
     * Clear entire cart
     */
    async clearCart(storeId, customerId) {
        const logContext = {
            storeId,
            customerId,
        };
        logger_1.logger.info(logContext, 'Clearing cart');
        // Verify cart exists
        const cart = await this.cartRepository.findActiveCart(storeId, customerId);
        if (!cart) {
            throw new Error('CART_NOT_FOUND');
        }
        // Clear cart
        await this.cartRepository.clearCart(cart.id);
        logger_1.logger.info({ cartId: cart.id }, 'Cart cleared');
    }
    /**
     * Get cart totals with promotions applied
     */
    async getCartTotals(cartId) {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            throw new Error('CART_NOT_FOUND');
        }
        // Prepare items for promotion calculation
        const items = cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: Number(item.product.price),
            categoryId: item.product.categoryId || undefined,
        }));
        // Use promotion service to calculate totals
        const totals = await this.promotionService.applyPromotionsToCart(cart.storeId, items);
        logger_1.logger.info({ cartId, ...totals }, 'Cart totals calculated');
        return totals;
    }
    /**
     * Convert cart to order (checkout)
     */
    async checkout(cartId, customerAddressId, paymentMethodId) {
        const cart = await this.cartRepository.findById(cartId);
        if (!cart) {
            throw new Error('CART_NOT_FOUND');
        }
        if (cart.status !== 'ACTIVE') {
            throw new Error('CART_NOT_ACTIVE');
        }
        logger_1.logger.info({ cartId }, 'Processing cart checkout');
        // Get cart totals
        const totals = await this.getCartTotals(cartId);
        // Here you would integrate with OrderService to create the order
        // For now, we'll just mark the cart as converted
        await this.cartRepository.updateStatus(cartId, 'CONVERTED');
        logger_1.logger.info({ cartId, orderId: null }, 'Cart converted to order');
        return {
            cartId,
            storeId: cart.storeId,
            customerId: cart.customerId,
            ...totals,
            customerAddressId,
            paymentMethodId,
            status: 'PENDING_ORDER_CREATION',
        };
    }
}
exports.CartService = CartService;
//# sourceMappingURL=index.js.map