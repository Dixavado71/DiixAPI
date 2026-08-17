import { Order, OrderStatus, PaymentMethod, DeliveryMethod } from '@prisma/client';
import { prisma } from '../../config/database';
import { OrderRepository } from '../../repositories/order.repository';
import { CartRepository } from '../../repositories/cart.repository';
import { ProductRepository } from '../../repositories/product.repository';
import { StoreSettingsRepository } from '../../repositories/store-settings.repository';
import { CustomerAuthorizationService } from '../customer/customer-authorization.service';
import { PromotionService } from '../promotion';
import { OrderStateMachine } from './order-state-machine';
import { getLogger } from '../../utils/logger';

const logger = getLogger();

interface CreateOrderInput {
  storeId: string;
  customerId: string;
  paymentMethod?: PaymentMethod;
  deliveryMethod?: DeliveryMethod;
  deliveryAddress?: string;
  notes?: string;
}

interface OrderResult {
  order: Order;
  message: string;
}

export class OrderService {
  private orderRepository: OrderRepository;
  private cartRepository: CartRepository;
  private productRepository: ProductRepository;
  private storeSettingsRepository: StoreSettingsRepository;
  private promotionService: PromotionService;

  constructor() {
    this.orderRepository = new OrderRepository(prisma);
    this.cartRepository = new CartRepository(prisma);
    this.productRepository = new ProductRepository(prisma);
    this.storeSettingsRepository = new StoreSettingsRepository(prisma);
    this.promotionService = new PromotionService();
  }

  /**
   * Generate unique order number
   */
  private generateOrderNumber(): string {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp}-${random}`;
  }

  /**
   * Create an order from the customer's active cart
   */
  async createOrderFromCart(input: CreateOrderInput): Promise<OrderResult> {
    const { storeId, customerId, paymentMethod, deliveryMethod, deliveryAddress, notes } = input;

    const logContext = {
      storeId,
      customerId,
      paymentMethod,
      deliveryMethod,
    };

    logger.info(logContext, 'Creating order from cart');

    // 1. Verify customer authorization
    const auth = new CustomerAuthorizationService();
    const isAllowed = await auth.isCustomerAllowed(storeId, customerId);
    if (!isAllowed) {
      logger.warn(logContext, 'Customer not authorized for this store');
      throw new Error('CUSTOMER_NOT_AUTHORIZED');
    }

    // 2. Get store settings
    const settings = await this.storeSettingsRepository.findByStoreId(storeId);
    if (!settings) {
      throw new Error('STORE_SETTINGS_NOT_FOUND');
    }

    // 3. Check if commerce is enabled
    if (!settings.commerceEnabled) {
      throw new Error('COMMERCE_DISABLED');
    }

    // 4. Validate payment method if provided
    if (paymentMethod) {
      const paymentEnabled =
        (paymentMethod === 'PIX' && settings.pixEnabled) ||
        (paymentMethod === 'CARD' && settings.cardEnabled) ||
        (paymentMethod === 'CASH' && settings.cashEnabled) ||
        (paymentMethod === 'PAYMENT_ON_DELIVERY' && settings.paymentOnDeliveryEnabled);

      if (!paymentEnabled) {
        throw new Error(`PAYMENT_METHOD_NOT_ENABLED: ${paymentMethod}`);
      }
    }

    // 5. Validate delivery method if provided
    if (deliveryMethod) {
      const deliveryEnabled =
        (deliveryMethod === 'PICKUP' && settings.pickupEnabled) ||
        ((deliveryMethod === 'STORE_DELIVERY' ||
          deliveryMethod === 'COURIER' ||
          deliveryMethod === 'THIRD_PARTY') &&
          settings.deliveryEnabled);

      if (!deliveryEnabled) {
        throw new Error(`DELIVERY_METHOD_NOT_ENABLED: ${deliveryMethod}`);
      }
    }

    // 6. Get customer's active cart
    const cart = await this.cartRepository.findActiveCart(storeId, customerId);
    if (!cart) {
      throw new Error('CART_NOT_FOUND');
    }

    const cartItems = await this.cartRepository.getCartItems(cart.id);
    if (cartItems.length === 0) {
      throw new Error('CART_EMPTY');
    }

    // 7. Validate products and calculate totals with promotions
    let subtotal = 0;
    let discount = 0;
    const orderItems: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }> = [];

    // Prepare items for promotion calculation
    const itemsForPromotion: Array<{
      productId: string;
      quantity: number;
      unitPrice: number;
      categoryId?: string;
    }> = [];

    for (const cartItem of cartItems) {
      // Fetch fresh product data to get current price and stock
      const product = await this.productRepository.findById(cartItem.productId);

      if (!product) {
        throw new Error(`PRODUCT_NOT_FOUND: ${cartItem.productId}`);
      }

      if (!product.active) {
        throw new Error(`PRODUCT_INACTIVE: ${product.name}`);
      }

      // Verify product belongs to the same store
      if (product.storeId !== storeId) {
        throw new Error('PRODUCT_STORE_MISMATCH');
      }

      // Calculate unit price (use promo price if available)
      const unitPrice = product.promoPrice ? Number(product.promoPrice) : Number(product.price);

      // Check stock if tracking is enabled
      if (product.stock !== null && product.stock !== undefined) {
        if (cartItem.quantity > product.stock) {
          throw new Error(`OUT_OF_STOCK: ${product.name}`);
        }
      }

      const itemTotal = unitPrice * cartItem.quantity;
      subtotal += itemTotal;

      // Add to items for promotion calculation
      itemsForPromotion.push({
        productId: product.id,
        quantity: cartItem.quantity,
        unitPrice,
        categoryId: product.categoryId || undefined,
      });

      orderItems.push({
        productId: product.id,
        quantity: cartItem.quantity,
        unitPrice,
        totalPrice: itemTotal,
      });
    }

    // 8. Apply promotions to calculate discount
    const promotionResult = await this.promotionService.applyPromotionsToCart(
      storeId,
      itemsForPromotion
    );
    discount = promotionResult.discount;

    // 9. Calculate delivery fee (future: based on delivery method and address)
    const deliveryFee = 0;

    // 10. Calculate total
    const total = subtotal - discount + deliveryFee;

    // 11. Create order with items in a transaction
    const order = await this.orderRepository.create({
      storeId,
      customerId,
      orderNumber: this.generateOrderNumber(),
      subtotal,
      discount,
      total,
      paymentMethod,
      deliveryMethod,
      deliveryAddress,
      deliveryFee,
      notes,
      items: orderItems,
    });

    logger.info({ orderId: order.id, total }, 'Order created successfully');

    // 12. Convert cart to CONVERTED status
    await this.cartRepository.updateStatus(cart.id, 'CONVERTED');

    return {
      order,
      message: 'Order created successfully',
    };
  }

  /**
   * Get order by ID
   */
  async getOrderById(orderId: string, storeId: string): Promise<Order> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new Error('ORDER_NOT_FOUND');
    }

    // Ensure order belongs to the specified store
    if (order.storeId !== storeId) {
      throw new Error('ORDER_STORE_MISMATCH');
    }

    return order;
  }

  /**
   * Get orders by store with optional filters
   */
  async getOrdersByStore(
    storeId: string,
    options?: {
      status?: OrderStatus;
      customerId?: string;
      limit?: number;
      offset?: number;
    }
  ): Promise<Order[]> {
    return this.orderRepository.findByStore(storeId, options);
  }

  /**
   * Update order status with state machine validation
   */
  async updateOrderStatus(
    orderId: string,
    storeId: string,
    newStatus: OrderStatus
  ): Promise<Order> {
    const order = await this.getOrderById(orderId, storeId);

    // Validate state transition
    OrderStateMachine.transition(order.status, newStatus);

    const updatedOrder = await this.orderRepository.updateStatus(orderId, newStatus);

    logger.info({ orderId, oldStatus: order.status, newStatus }, 'Order status updated');

    return updatedOrder;
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, storeId: string, reason?: string): Promise<Order> {
    const order = await this.getOrderById(orderId, storeId);

    // Check if order can be cancelled
    if (!OrderStateMachine.canCancel(order.status)) {
      throw new Error(`ORDER_CANNOT_BE_CANCELLED: Current status is ${order.status}`);
    }

    const cancelledOrder = await this.orderRepository.updateStatus(orderId, 'CANCELLED');

    logger.info({ orderId, reason, previousStatus: order.status }, 'Order cancelled');

    return cancelledOrder;
  }

  /**
   * Update payment status
   */
  async updatePaymentStatus(orderId: string, storeId: string, paymentStatus: any): Promise<Order> {
    const order = await this.getOrderById(orderId, storeId);

    const updatedOrder = await this.orderRepository.updatePaymentStatus(orderId, paymentStatus);

    // If payment is confirmed and order is in PAYMENT_PENDING, transition to PAID or PREPARING
    if (paymentStatus === 'PAID' && order.status === 'PAYMENT_PENDING') {
      const nextStatus = OrderStateMachine.canTransition('PAYMENT_PENDING', 'PAID')
        ? 'PAID'
        : 'PREPARING';
      return this.orderRepository.updateStatus(orderId, nextStatus);
    }

    return updatedOrder;
  }
}
