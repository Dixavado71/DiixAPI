import { ProductRepository } from '../../repositories/product.repository';
import { prisma } from '../../config/database';
import type { Product } from '@prisma/client';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository(prisma);
  }

  async findAll(
    storeId: string,
    filters?: {
      category?: string;
      search?: string;
      minPrice?: number;
      maxPrice?: number;
    }
  ): Promise<Product[]> {
    const result = await this.repository.findByStore(storeId, {
      categoryId: filters?.category,
      active: true,
    });
    return result.products;
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async create(data: {
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
  }): Promise<Product> {
    return this.repository.create(data);
  }

  async update(
    id: string,
    data: Partial<{
      name: string;
      description?: string;
      sku?: string;
      price: number;
      promoPrice?: number;
      stock?: number;
      active: boolean;
      images: string[];
      categoryId?: string;
    }>
  ): Promise<Product> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    await this.repository.deactivate(id);
  }
}
