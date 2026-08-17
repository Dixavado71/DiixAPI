"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreSettingsRepository = void 0;
class StoreSettingsRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findByStoreId(storeId) {
        return this.prisma.storeSettings.findUnique({
            where: { storeId },
        });
    }
    async create(storeId, data = {}) {
        return this.prisma.storeSettings.create({
            data: {
                storeId,
                ...data,
            },
        });
    }
    async update(storeId, data) {
        return this.prisma.storeSettings.update({
            where: { storeId },
            data,
        });
    }
    async upsert(storeId, data) {
        return this.prisma.storeSettings.upsert({
            where: { storeId },
            create: {
                storeId,
                ...data,
            },
            update: data,
        });
    }
    async deleteByStoreId(storeId) {
        await this.prisma.storeSettings.delete({
            where: { storeId },
        });
    }
}
exports.StoreSettingsRepository = StoreSettingsRepository;
//# sourceMappingURL=store-settings.repository.js.map