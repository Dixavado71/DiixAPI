import { CustomerStatus } from '@prisma/client';
export class CustomerRepository {
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
        return this.updateStatus(id, CustomerStatus.ACTIVE);
    }
    async deactivate(id) {
        return this.updateStatus(id, CustomerStatus.INACTIVE);
    }
    async block(id) {
        return this.updateStatus(id, CustomerStatus.BLOCKED);
    }
    async unblock(id) {
        return this.updateStatus(id, CustomerStatus.ACTIVE);
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
//# sourceMappingURL=customer.repository.js.map