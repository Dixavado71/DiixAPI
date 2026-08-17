"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRepository = void 0;
const client_1 = require("@prisma/client");
class CustomerRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findById(id) {
        return this.prisma.customer.findUnique({
            where: { id },
        });
    }
    async findByPhone(phone) {
        return this.prisma.customer.findUnique({
            where: { phone },
        });
    }
    async findAll() {
        return this.prisma.customer.findMany({
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(data) {
        return this.prisma.customer.create({
            data,
        });
    }
    async update(id, data) {
        return this.prisma.customer.update({
            where: { id },
            data,
        });
    }
    async updateStatus(id, status) {
        return this.prisma.customer.update({
            where: { id },
            data: { status },
        });
    }
    async activate(id) {
        return this.updateStatus(id, client_1.CustomerStatus.ACTIVE);
    }
    async deactivate(id) {
        return this.updateStatus(id, client_1.CustomerStatus.INACTIVE);
    }
    async block(id) {
        return this.updateStatus(id, client_1.CustomerStatus.BLOCKED);
    }
    async unblock(id) {
        return this.updateStatus(id, client_1.CustomerStatus.ACTIVE);
    }
    async existsByPhone(phone, excludeId) {
        const customer = await this.prisma.customer.findFirst({
            where: {
                phone,
                ...(excludeId ? { NOT: { id: excludeId } } : {}),
            },
        });
        return !!customer;
    }
}
exports.CustomerRepository = CustomerRepository;
//# sourceMappingURL=customer.repository.js.map