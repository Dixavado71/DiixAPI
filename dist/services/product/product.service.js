"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductService = void 0;
const product_repository_1 = require("../../repositories/product.repository");
const database_1 = require("../../config/database");
class ProductService {
    repository;
    constructor() {
        this.repository = new product_repository_1.ProductRepository(database_1.prisma);
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
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map