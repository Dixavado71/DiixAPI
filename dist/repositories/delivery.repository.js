"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeliveryRepository = void 0;
class DeliveryRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async create(data) {
        return this.prisma.delivery.create({
            data: {
                orderId: data.orderId,
                storeId: data.storeId,
                method: data.method,
                address: data.address,
                recipientName: data.recipientName,
                recipientPhone: data.recipientPhone,
                status: 'PENDING',
                trackingInfo: data.trackingInfo,
            },
            include: {
                order: true,
            },
        });
    }
    async findById(id) {
        return this.prisma.delivery.findUnique({
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
        return this.prisma.delivery.findUnique({
            where: { orderId },
        });
    }
    async updateStatus(id, status, trackingInfo) {
        const updateData = {
            status: status,
            updatedAt: new Date(),
        };
        if (trackingInfo !== undefined) {
            updateData.trackingInfo = trackingInfo;
        }
        if (status === 'DELIVERED') {
            updateData.deliveredAt = new Date();
        }
        return this.prisma.delivery.update({
            where: { id },
            data: updateData,
        });
    }
}
exports.DeliveryRepository = DeliveryRepository;
//# sourceMappingURL=delivery.repository.js.map