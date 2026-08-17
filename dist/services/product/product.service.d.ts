import type { Product } from '@prisma/client';
export declare class ProductService {
    private repository;
    constructor();
    findAll(storeId: string, filters?: {
        category?: string;
        search?: string;
        minPrice?: number;
        maxPrice?: number;
    }): Promise<Product[]>;
    findById(id: string): Promise<Product | null>;
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
    }): Promise<Product>;
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
    }>): Promise<Product>;
    delete(id: string): Promise<void>;
}
//# sourceMappingURL=product.service.d.ts.map