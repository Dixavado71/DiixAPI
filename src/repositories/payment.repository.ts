import { PrismaClient } from '@prisma/client';

export class PaymentRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async create(data: {
    orderId: string;
    method: string;
    amount: number;
    transactionId?: string;
    metadata?: Record<string, unknown>;
  }) {
    return this.prisma.payment.create({
      data: {
        orderId: data.orderId,
        method: data.method as any,
        amount: data.amount,
        status: 'PENDING',
        transactionId: data.transactionId,
        metadata: data.metadata ? (data.metadata as any) : null,
      },
      include: {
        order: true,
      },
    });
  }

  async findById(id: string) {
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

  async findByOrderId(orderId: string) {
    return this.prisma.payment.findMany({
      where: { orderId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: string, transactionId?: string, metadata?: Record<string, unknown>) {
    return this.prisma.payment.update({
      where: { id },
      data: {
        status: status as any,
        transactionId,
        metadata: metadata ? (metadata as any) : undefined,
        updatedAt: new Date(),
      },
    });
  }
}
