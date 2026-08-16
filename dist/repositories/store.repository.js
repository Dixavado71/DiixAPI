"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreRepository = void 0;
const client_1 = require("@prisma/client");
class StoreRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.store.findUnique({
            where: { id },
        });
    }
    async findBySlug(slug) {
        return this.prisma.store.findUnique({
            where: { slug },
        });
    }
    async findByEvolutionInstance(instanceName) {
        return this.prisma.store.findFirst({
            where: { evolutionInstanceId: instanceName },
        });
    }
    async findAll() {
        return this.prisma.store.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(data) {
        return this.prisma.store.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.store.update({
            where: { id },
            data,
        });
    }
    async updateStatus(id, status) {
        return this.prisma.store.update({
            where: { id },
            data: { status },
        });
    }
    async activate(id) {
        return this.updateStatus(id, client_1.StoreStatus.ACTIVE);
    }
    async deactivate(id) {
        return this.updateStatus(id, client_1.StoreStatus.INACTIVE);
    }
    async suspend(id) {
        return this.updateStatus(id, client_1.StoreStatus.SUSPENDED);
    }
    async existsBySlug(slug, excludeId) {
        const store = await this.prisma.store.findFirst({
            where: {
                slug,
                ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
        });
        return !!store;
    }
    async existsByEvolutionInstance(instanceName, excludeId) {
        const store = await this.prisma.store.findFirst({
            where: {
                evolutionInstanceId: instanceName,
                ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
        });
        return !!store;
    }
}
exports.StoreRepository = StoreRepository;
//# sourceMappingURL=store.repository.js.map