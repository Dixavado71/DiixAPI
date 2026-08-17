import { ProductRepository } from '../../repositories/product.repository';
import { prisma } from '../../config/database';
export class ProductService {
    repository;
    constructor() {
        this.repository = new ProductRepository(prisma);
    }
    async findAll(storeId, filters) {
        const result = await this.repository.findByStore(storeId, {
            categoryId: filters?.category,
            active: true,
        });
        return result.products;
    }
    async findById(id) {
        return this.repository.findById(id);
    }
    async create(data) {
        return this.repository.create(data);
    }
    async update(id, data) {
        return this.repository.update(id, data);
    }
    async delete(id) {
        await this.repository.deactivate(id);
    }
}
//# sourceMappingURL=product.service.js.map