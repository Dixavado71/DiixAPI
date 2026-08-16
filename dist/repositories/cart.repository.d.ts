import { PrismaClient, Cart, CartItem } from '@prisma/client';
export declare class CartRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findActiveCart(storeId: string, customerId: string): Promise<Cart | null>;
    getCartItems(cartId: string): Promise<CartItem[]>;
    getOrCreateCart(storeId: string, customerId: string): Promise<{
        items: ({
            product: {
                name: string;
                id: string;
                storeId: string;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string | null;
                description: string | null;
                sku: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                promoPrice: import("@prisma/client/runtime/library").Decimal | null;
                stock: number | null;
                active: boolean;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        status: import(".prisma/client").$Enums.CartStatus;
        id: string;
        storeId: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    findById(id: string): Promise<({
        store: {
            name: string;
            status: import(".prisma/client").$Enums.StoreStatus;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            slug: string;
            phone: string | null;
            timezone: string;
            currency: string;
            evolutionInstanceId: string | null;
        };
        items: ({
            product: {
                name: string;
                id: string;
                storeId: string;
                createdAt: Date;
                updatedAt: Date;
                categoryId: string | null;
                description: string | null;
                sku: string | null;
                price: import("@prisma/client/runtime/library").Decimal;
                promoPrice: import("@prisma/client/runtime/library").Decimal | null;
                stock: number | null;
                active: boolean;
                images: string[];
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            cartId: string;
            productId: string;
            quantity: number;
        })[];
    } & {
        status: import(".prisma/client").$Enums.CartStatus;
        id: string;
        storeId: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    addItem(cartId: string, productId: string, quantity: number): Promise<{
        product: {
            name: string;
            id: string;
            storeId: string;
            createdAt: Date;
            updatedAt: Date;
            categoryId: string | null;
            description: string | null;
            sku: string | null;
            price: import("@prisma/client/runtime/library").Decimal;
            promoPrice: import("@prisma/client/runtime/library").Decimal | null;
            stock: number | null;
            active: boolean;
            images: string[];
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cartId: string;
        productId: string;
        quantity: number;
    }>;
    updateItem(itemId: string, quantity: number): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cartId: string;
        productId: string;
        quantity: number;
    }>;
    removeItem(itemId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        cartId: string;
        productId: string;
        quantity: number;
    }>;
    clearCart(cartId: string): Promise<import(".prisma/client").Prisma.BatchPayload>;
    updateStatus(cartId: string, status: string): Promise<{
        status: import(".prisma/client").$Enums.CartStatus;
        id: string;
        storeId: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=cart.repository.d.ts.map