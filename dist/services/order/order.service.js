"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderService = void 0;
const database_js_1 = require("../../config/database.js");
const order_repository_js_1 = require("../../repositories/order.repository.js");
const cart_repository_js_1 = require("../../repositories/cart.repository.js");
const product_repository_js_1 = require("../../repositories/product.repository.js");
const store_settings_repository_js_1 = require("../../repositories/store-settings.repository.js");
const customer_authorization_service_js_1 = require("../customer/customer-authorization.service.js");
const order_state_machine_js_1 = require("./order-state-machine.js");
const logger_js_1 = __importDefault(require("../../utils/logger.js"));
class OrderService {
    orderRepository;
    cartRepository;
    productRepository;
    storeSettingsRepository;
    constructor() {
        this.orderRepository = new order_repository_js_1.OrderRepository(database_js_1.prisma);
        this.cartRepository = new cart_repository_js_1.CartRepository(database_js_1.prisma);
        this.productRepository = new product_repository_js_1.ProductRepository(database_js_1.prisma);
        this.storeSettingsRepository = new store_settings_repository_js_1.StoreSettingsRepository(database_js_1.prisma);
    }
    /**
     * Generate unique order number
     */
    generateOrderNumber() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }
    /**
     * Create an order from the customer's active cart
     */
    async createOrderFromCart(input) {
        const { storeId, customerId, paymentMethod, deliveryMethod, deliveryAddress, notes } = input;
        const logContext = {
            storeId,
            customerId,
            paymentMethod,
            deliveryMethod,
        };
        logger_js_1.default.info(logContext, 'Creating order from cart');
        // 1. Verify customer authorization
        const isAllowed = await customer_authorization_service_js_1.CustomerAuthorizationService.isCustomerAllowed(storeId, customerId);
        if (!isAllowed) {
            logger_js_1.default.warn(logContext, 'Customer not authorized for this store');
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
            const paymentEnabled = (paymentMethod === 'PIX' && settings.pixEnabled) ||
                (paymentMethod === 'CARD' && settings.cardEnabled) ||
                (paymentMethod === 'CASH' && settings.cashEnabled) ||
                (paymentMethod === 'PAYMENT_ON_DELIVERY' && settings.paymentOnDeliveryEnabled);
            if (!paymentEnabled) {
                throw new Error(`PAYMENT_METHOD_NOT_ENABLED: ${paymentMethod}`);
            }
        }
        // 5. Validate delivery method if provided
        if (deliveryMethod) {
            const deliveryEnabled = (deliveryMethod === 'PICKUP' && settings.pickupEnabled) ||
                ((deliveryMethod === 'STORE_DELIVERY' || deliveryMethod === 'COURIER' || deliveryMethod === 'THIRD_PARTY') && settings.deliveryEnabled);
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
        // 7. Validate products and calculate totals
        let subtotal = 0;
        const orderItems = [];
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
            const totalPrice = unitPrice * cartItem.quantity;
            subtotal += totalPrice;
            orderItems.push({
                productId: product.id,
                quantity: cartItem.quantity,
                unitPrice,
                totalPrice,
            });
        }
        // 8. Calculate discount (future: apply promotions)
        const discount = 0;
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
        logger_js_1.default.info({ orderId: order.id, total }, 'Order created successfully');
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
    async getOrderById(orderId, storeId) {
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
    async getOrdersByStore(storeId, options) {
        return this.orderRepository.findByStore(storeId, options);
    }
    /**
     * Update order status with state machine validation
     */
    async updateOrderStatus(orderId, storeId, newStatus) {
        const order = await this.getOrderById(orderId, storeId);
        // Validate state transition
        order_state_machine_js_1.OrderStateMachine.transition(order.status, newStatus);
        const updatedOrder = await this.orderRepository.updateStatus(orderId, newStatus);
        logger_js_1.default.info({ orderId, oldStatus: order.status, newStatus }, 'Order status updated');
        return updatedOrder;
    }
    /**
     * Cancel an order
     */
    async cancelOrder(orderId, storeId, reason) {
        const order = await this.getOrderById(orderId, storeId);
        // Check if order can be cancelled
        if (!order_state_machine_js_1.OrderStateMachine.canCancel(order.status)) {
            throw new Error(`ORDER_CANNOT_BE_CANCELLED: Current status is ${order.status}`);
        }
        const cancelledOrder = await this.orderRepository.updateStatus(orderId, 'CANCELLED');
        logger_js_1.default.info({ orderId, reason, previousStatus: order.status }, 'Order cancelled');
        return cancelledOrder;
    }
    /**
     * Update payment status
     */
    async updatePaymentStatus(orderId, storeId, paymentStatus) {
        const order = await this.getOrderById(orderId, storeId);
        const updatedOrder = await this.orderRepository.updatePaymentStatus(orderId, paymentStatus);
        // If payment is confirmed and order is in PAYMENT_PENDING, transition to PAID or PREPARING
        if (paymentStatus === 'PAID' && order.status === 'PAYMENT_PENDING') {
            const nextStatus = order_state_machine_js_1.OrderStateMachine.canTransition('PAYMENT_PENDING', 'PAID') ? 'PAID' : 'PREPARING';
            return this.orderRepository.updateStatus(orderId, nextStatus);
        }
        return updatedOrder;
    }
}
exports.OrderService = OrderService;
//# sourceMappingURL=order.service.js.map