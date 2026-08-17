import { ProductRepository } from '../../repositories/product.repository';
import { prisma } from '../../config/database';
import type { Product, Prisma } from '@prisma/client';

export class ProductService {
  private repository: ProductRepository;

  constructor() {
    this.repository = new ProductRepository(prisma);
  }

  async findAll(storeId: string, filters?: {
    category?: string;
    search?: string;
    minPrice?: number;
    maxPrice?: number;
  }): Promise<Product[]> {
    return this.repository.findAll(storeId, filters);
  }

  async findById(id: string): Promise<Product | null> {
    return this.repository.findById(id);
  }

  async create(data: Prisma.ProductCreateInput): Promise<Product> {
    return this.repository.create(data);
  }

  async update(id: string, data: Prisma.ProductUpdateInput): Promise<Product> {
    return this.repository.update(id, data);
  }

  async delete(id: string): Promise<void> {
    return this.repository.delete(id);
  }
}
