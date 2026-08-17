export class PaymentRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.payment.create({
            data: {
                orderId: data.orderId,
                method: data.method,
                amount: data.amount,
                status: 'PENDING',
                transactionId: data.transactionId,
                metadata: data.metadata ? data.metadata : null,
            },
            include: {
                order: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.payment.findUnique({
            where: { id },
            include: {
                order: {
                    include: {
                        items: true,
                    },
                },
            },
        });
    }
    async findByOrderId(orderId) {
        return this.prisma.payment.findMany({
            where: { orderId },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateStatus(id, status, transactionId, metadata) {
        return this.prisma.payment.update({
            where: { id },
            data: {
                status: status,
                transactionId,
                metadata: metadata ? metadata : undefined,
                updatedAt: new Date(),
            },
        });
    }
}
//# sourceMappingURL=payment.repository.js.map