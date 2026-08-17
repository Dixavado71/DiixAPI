import type { Cart, CartItem } from '@prisma/client';
export declare class CartService {
    findByCustomerId(customerId: string): Promise<Cart | null>;
    create(customerId: string, storeId: string): Promise<Cart>;
    addItem(cartId: string, productId: string, quantity: number): Promise<CartItem>;
    removeItem(cartId: string, productId: string): Promise<void>;
    clear(cartId: string): Promise<void>;
    getItems(cartId: string): Promise<CartItem[]>;
}
//# sourceMappingURL=cart.service.d.ts.map