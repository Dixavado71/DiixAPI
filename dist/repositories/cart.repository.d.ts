import { PrismaClient } from '@prisma/client';
export declare class CartRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    getOrCreateCart(storeId: string, customerId: string): Promise<{
        items: ({
            product: {
                name: string;
                storeId: string;
                id: string;
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
        storeId: string;
        id: string;
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
            phone: string | null;
            slug: string;
            timezone: string;
            currency: string;
            evolutionInstanceId: string | null;
        };
        items: ({
            product: {
                name: string;
                storeId: string;
                id: string;
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
        storeId: string;
        id: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
    }) | null>;
    addItem(cartId: string, productId: string, quantity: number): Promise<{
        product: {
            name: string;
            storeId: string;
            id: string;
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
        storeId: string;
        id: string;
        customerId: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
//# sourceMappingURL=cart.repository.d.ts.map