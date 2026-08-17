import { PrismaClient, DeliveryMethod, DeliveryStatus } from '@prisma/client';

export class DeliveryRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    orderId: string;
    storeId: string;
    method: string;
    address: string;
    recipientName: string;
    recipientPhone: string;
    trackingInfo?: string;
  }) {
    return this.prisma.delivery.create({
      data: {
        orderId: data.orderId,
        storeId: data.storeId,
        method: data.method as DeliveryMethod,
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

  async findById(id: string) {
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

  async findByOrderId(orderId: string) {
    return this.prisma.delivery.findUnique({
      where: { orderId },
    });
  }

  async updateStatus(id: string, status: string, trackingInfo?: string) {
    const updateData: {
      status: DeliveryStatus;
      updatedAt: Date;
      trackingInfo?: string;
      deliveredAt?: Date;
    } = {
      status: status as DeliveryStatus,
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
