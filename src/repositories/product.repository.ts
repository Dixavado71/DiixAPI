import { PrismaClient } from '@prisma/client';

export class ProductRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findById(id: string) {
    return this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        variants: true,
      },
    });
  }

  async findByStore(storeId: string, options?: { categoryId?: string; active?: boolean; page?: number; limit?: number }) {
    const { categoryId, active, page = 1, limit = 20 } = options || {};

    const where: any = { storeId };
    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (active !== undefined) {
      where.active = active;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        include: {
          category: true,
          variants: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.product.count({ where }),
    ]);

    return { products, total, page, limit };
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
  }) {
    return this.prisma.product.create({
      data: {
        storeId: data.storeId,
        categoryId: data.categoryId,
        name: data.name,
        description: data.description,
        sku: data.sku,
        price: data.price,
        promoPrice: data.promoPrice,
        stock: data.stock,
        active: data.active ?? true,
        images: data.images ?? [],
      },
      include: {
        category: true,
      },
    });
  }

  async update(id: string, data: Partial<{
    name: string;
    description?: string;
    sku?: string;
    price: number;
    promoPrice?: number;
    stock?: number;
    active: boolean;
    images: string[];
    categoryId?: string;
  }>) {
    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async activate(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { active: true },
    });
  }

  async deactivate(id: string) {
    return this.prisma.product.update({
      where: { id },
      data: { active: false },
    });
  }
}
