import { PrismaClient } from '@prisma/client';
export declare class ProductRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<({
        category: {
            name: string;
            storeId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            active: boolean;
            parentId: string | null;
        } | null;
        variants: {
            name: string;
            value: string;
            id: string;
            productId: string;
            price: import("@prisma/client/runtime/library").Decimal | null;
            stock: number | null;
        }[];
    } & {
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
    }) | null>;
    findByStore(storeId: string, options?: {
        categoryId?: string;
        active?: boolean;
        page?: number;
        limit?: number;
    }): Promise<{
        products: ({
            category: {
                name: string;
                storeId: string;
                id: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                active: boolean;
                parentId: string | null;
            } | null;
            variants: {
                name: string;
                value: string;
                id: string;
                productId: string;
                price: import("@prisma/client/runtime/library").Decimal | null;
                stock: number | null;
            }[];
        } & {
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
        })[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: {
        storeId: string;
        categoryId?: string;
        name: string;
        description?: string;
        sku?: string;
        price: number;
        promoPrice?: number;
        stock?: number;
        active?: boolean;
        images?: string[];
    }): Promise<{
        category: {
            name: string;
            storeId: string;
            id: string;
            createdAt: Date;
            updatedAt: Date;
            description: string | null;
            active: boolean;
            parentId: string | null;
        } | null;
    } & {
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
    }>;
    update(id: string, data: Partial<{
        name: string;
        description?: string;
        sku?: string;
        price: number;
        promoPrice?: number;
        stock?: number;
        active: boolean;
        images: string[];
        categoryId?: string;
    }>): Promise<{
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
    }>;
    activate(id: string): Promise<{
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
    }>;
    deactivate(id: string): Promise<{
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
    }>;
}
//# sourceMappingURL=product.repository.d.ts.map