import { Cart, CartItem, Product } from '@prisma/client';
interface CartItemWithProduct extends CartItem {
    product: Product;
}
interface CartWithItems extends Cart {
    items: CartItemWithProduct[];
}
export declare class CartService {
    private cartRepository;
    private productRepository;
    private promotionService;
    constructor();
    /**
     * Get or create active cart for customer
     */
    getOrCreateCart(storeId: string, customerId: string): Promise<CartWithItems>;
    /**
     * Add item to cart
     */
    addItem(storeId: string, customerId: string, productId: string, quantity: number): Promise<CartWithItems>;
    /**
     * Update cart item quantity
     */
    updateItem(storeId: string, customerId: string, itemId: string, quantity: number): Promise<CartWithItems>;
    /**
     * Remove item from cart
     */
    removeItem(storeId: string, customerId: string, itemId: string): Promise<CartWithItems>;
    /**
     * Clear entire cart
     */
    clearCart(storeId: string, customerId: string): Promise<void>;
    /**
     * Get cart totals with promotions applied
     */
    getCartTotals(cartId: string): Promise<{
        subtotal: number;
        discount: number;
        total: number;
        appliedPromotions: Array<{
            promotionId: string;
            discount: number;
        }>;
    }>;
    /**
     * Convert cart to order (checkout)
     */
    checkout(cartId: string, customerAddressId: string, paymentMethodId: string): Promise<any>;
}
export {};
//# sourceMappingURL=index.d.ts.map