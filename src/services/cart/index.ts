import { Cart, CartItem, Product } from '@prisma/client';
import { CartRepository } from '../../repositories/cart.repository';
import { ProductRepository } from '../../repositories/product.repository';
import { PromotionService } from '../promotion';
import { prisma } from '../../config/database';
import { logger } from '../../utils/logger';

interface CartItemWithProduct extends CartItem {
  product: Product;
}

interface CartWithItems extends Cart {
  items: CartItemWithProduct[];
}

export class CartService {
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;
  private promotionService: PromotionService;

  constructor() {
    this.cartRepository = new CartRepository(prisma);
    this.productRepository = new ProductRepository(prisma);
    this.promotionService = new PromotionService();
  }

  /**
   * Get or create active cart for customer
   */
  async getOrCreateCart(storeId: string, customerId: string): Promise<CartWithItems> {
    const cart = await this.cartRepository.getOrCreateCart(storeId, customerId);
    return cart as CartWithItems;
  }

  /**
   * Add item to cart
   */
  async addItem(
    storeId: string,
    customerId: string,
    productId: string,
    quantity: number
  ): Promise<CartWithItems> {
    const logContext = {
      storeId,
      customerId,
      productId,
      quantity,
    };

    logger.info(logContext, 'Adding item to cart');

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
    logger.info({ cartId: cart.id }, 'Item added to cart');

    return updatedCart as CartWithItems;
  }

  /**
   * Update cart item quantity
   */
  async updateItem(
    storeId: string,
    customerId: string,
    itemId: string,
    quantity: number
  ): Promise<CartWithItems> {
    const logContext = {
      storeId,
      customerId,
      itemId,
      quantity,
    };

    logger.info(logContext, 'Updating cart item');

    // Verify cart belongs to customer and store
    const cart = await this.cartRepository.findActiveCart(storeId, customerId);
    if (!cart) {
      throw new Error('CART_NOT_FOUND');
    }

    // Update item
    await this.cartRepository.updateItem(itemId, quantity);

    // Return updated cart
    const updatedCart = await this.cartRepository.findById(cart.id);
    logger.info({ cartId: cart.id, itemId }, 'Cart item updated');

    return updatedCart as CartWithItems;
  }

  /**
   * Remove item from cart
   */
  async removeItem(
    storeId: string,
    customerId: string,
    itemId: string
  ): Promise<CartWithItems> {
    const logContext = {
      storeId,
      customerId,
      itemId,
    };

    logger.info(logContext, 'Removing item from cart');

    // Verify cart belongs to customer and store
    const cart = await this.cartRepository.findActiveCart(storeId, customerId);
    if (!cart) {
      throw new Error('CART_NOT_FOUND');
    }

    // Remove item
    await this.cartRepository.removeItem(itemId);

    // Return updated cart
    const updatedCart = await this.cartRepository.findById(cart.id);
    logger.info({ cartId: cart.id, itemId }, 'Item removed from cart');

    return updatedCart as CartWithItems;
  }

  /**
   * Clear entire cart
   */
  async clearCart(storeId: string, customerId: string): Promise<void> {
    const logContext = {
      storeId,
      customerId,
    };

    logger.info(logContext, 'Clearing cart');

    // Verify cart exists
    const cart = await this.cartRepository.findActiveCart(storeId, customerId);
    if (!cart) {
      throw new Error('CART_NOT_FOUND');
    }

    // Clear cart
    await this.cartRepository.clearCart(cart.id);
    logger.info({ cartId: cart.id }, 'Cart cleared');
  }

  /**
   * Get cart totals with promotions applied
   */
  async getCartTotals(cartId: string): Promise<{
    subtotal: number;
    discount: number;
    total: number;
    appliedPromotions: Array<{ promotionId: string; discount: number }>;
  }> {
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

    logger.info({ cartId, ...totals }, 'Cart totals calculated');

    return totals;
  }

  /**
   * Convert cart to order (checkout)
   */
  async checkout(
    cartId: string,
    customerAddressId: string,
    paymentMethodId: string
  ): Promise<any> {
    const cart = await this.cartRepository.findById(cartId);
    if (!cart) {
      throw new Error('CART_NOT_FOUND');
    }

    if (cart.status !== 'ACTIVE') {
      throw new Error('CART_NOT_ACTIVE');
    }

    logger.info({ cartId }, 'Processing cart checkout');

    // Get cart totals
    const totals = await this.getCartTotals(cartId);

    // Here you would integrate with OrderService to create the order
    // For now, we'll just mark the cart as converted
    await this.cartRepository.updateStatus(cartId, 'CONVERTED');

    logger.info({ cartId, orderId: null }, 'Cart converted to order');

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
