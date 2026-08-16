"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreCustomerRepository = void 0;
const client_1 = require("@prisma/client");
class StoreCustomerRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.storeCustomer.findUnique({
            where: { id },
        });
    }
    async findByStoreAndCustomer(storeId, customerId) {
        return this.prisma.storeCustomer.findUnique({
            where: {
                storeId_customerId: {
                    storeId,
                    customerId,
                },
            },
        });
    }
    async findByStore(storeId) {
        return this.prisma.storeCustomer.findMany({
            where: { storeId },
            include: {
                customer: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async findByCustomer(customerId) {
        return this.prisma.storeCustomer.findMany({
            where: { customerId },
            include: {
                store: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(storeId, customerId) {
        return this.prisma.storeCustomer.create({
            data: {
                storeId,
                customerId,
            },
        });
    }
    async updateStatus(storeId, customerId, status) {
        const now = new Date();
        return this.prisma.storeCustomer.update({
            where: {
                storeId_customerId: {
                    storeId,
                    customerId,
                },
            },
            data: {
                status,
                approvedAt: status === client_1.StoreCustomerStatus.APPROVED ? now : null,
                blockedAt: status === client_1.StoreCustomerStatus.BLOCKED ? now : null,
            },
        });
    }
    async approve(storeId, customerId) {
        return this.updateStatus(storeId, customerId, client_1.StoreCustomerStatus.APPROVED);
    }
    async block(storeId, customerId) {
        return this.updateStatus(storeId, customerId, client_1.StoreCustomerStatus.BLOCKED);
    }
    async deactivate(storeId, customerId) {
        return this.updateStatus(storeId, customerId, client_1.StoreCustomerStatus.INACTIVE);
    }
    async reactivate(storeId, customerId) {
        return this.updateStatus(storeId, customerId, client_1.StoreCustomerStatus.PENDING);
    }
    async deleteByStoreAndCustomer(storeId, customerId) {
        await this.prisma.storeCustomer.delete({
            where: {
                storeId_customerId: {
                    storeId,
                    customerId,
                },
            },
        });
    }
    async exists(storeId, customerId) {
        const storeCustomer = await this.prisma.storeCustomer.findFirst({
            where: {
                storeId,
                customerId,
            },
        });
        return !!storeCustomer;
    }
}
exports.StoreCustomerRepository = StoreCustomerRepository;
//# sourceMappingURL=store-customer.repository.js.map