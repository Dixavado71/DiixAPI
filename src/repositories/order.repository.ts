import { PrismaClient, Order, OrderStatus } from '@prisma/client';

export class OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        payments: true,
        delivery: true,
      },
    });
  }

  async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    return this.prisma.order.findUnique({
      where: { orderNumber },
      include: {
        items: true,
        payments: true,
        delivery: true,
      },
    });
  }

  async findByStore(storeId: string, options?: {
    status?: OrderStatus;
    customerId?: string;
    limit?: number;
    offset?: number;
  }): Promise<Order[]> {
    const where: any = { storeId };

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.customerId) {
      where.customerId = options.customerId;
    }

    return this.prisma.order.findMany({
      where,
      include: {
        items: true,
        payments: true,
        delivery: true,
      },
      orderBy: { createdAt: 'desc' },
      take: options?.limit ?? 50,
      skip: options?.offset ?? 0,
    });
  }

  async create(data: {
    storeId: string;
    customerId: string;
    orderNumber: string;
    subtotal: number;
    discount: number;
    total: number;
    paymentMethod?: any;
    deliveryMethod?: any;
    deliveryAddress?: string;
    deliveryFee?: number;
    notes?: string;
    items: {
      productId: string;
      quantity: number;
      unitPrice: number;
      totalPrice: number;
    }[];
  }): Promise<Order> {
    return this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          storeId: data.storeId,
          customerId: data.customerId,
          orderNumber: data.orderNumber,
          subtotal: data.subtotal,
          discount: data.discount,
          total: data.total,
          paymentMethod: data.paymentMethod,
          paymentStatus: 'PENDING',
          deliveryMethod: data.deliveryMethod,
          deliveryAddress: data.deliveryAddress,
          deliveryFee: data.deliveryFee ?? 0,
          notes: data.notes,
          status: 'PENDING',
        },
      });

      await tx.orderItem.createMany({
        data: data.items.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      });

      return tx.order.findUnique({
        where: { id: order.id },
        include: {
          items: true,
          payments: true,
          delivery: true,
        },
      }) as Promise<Order>;
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
        payments: true,
        delivery: true,
      },
    });
  }

  async updatePaymentStatus(id: string, paymentStatus: any): Promise<Order> {
    return this.prisma.order.update({
      where: { id },
      data: { paymentStatus },
      include: {
        items: true,
        payments: true,
        delivery: true,
      },
    });
  }

  async countByStore(storeId: string): Promise<number> {
    return this.prisma.order.count({
      where: { storeId },
    });
  }
}
