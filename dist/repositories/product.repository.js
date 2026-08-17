"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductRepository = void 0;
class ProductRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.product.findUnique({
            where: { id },
            include: {
                category: true,
                variants: true,
            },
        });
    }
    async findByStore(storeId, options) {
        const { categoryId, active, page = 1, limit = 20 } = options || {};
        const where = { storeId };
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
    async create(data) {
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
    async update(id, data) {
        return this.prisma.product.update({
            where: { id },
            data,
        });
    }
    async activate(id) {
        return this.prisma.product.update({
            where: { id },
            data: { active: true },
        });
    }
    async deactivate(id) {
        return this.prisma.product.update({
            where: { id },
            data: { active: false },
        });
    }
}
exports.ProductRepository = ProductRepository;
//# sourceMappingURL=product.repository.js.map