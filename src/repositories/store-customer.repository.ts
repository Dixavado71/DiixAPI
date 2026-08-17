import { PrismaClient, StoreCustomer, StoreCustomerStatus } from '@prisma/client';

export class StoreCustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<StoreCustomer | null> {
    return this.prisma.storeCustomer.findUnique({
      where: { id },
    });
  }

  async findByStoreAndCustomer(storeId: string, customerId: string): Promise<StoreCustomer | null> {
    return this.prisma.storeCustomer.findUnique({
      where: {
        storeId_customerId: {
          storeId,
          customerId,
        },
      },
    });
  }

  async findByStore(storeId: string): Promise<StoreCustomer[]> {
    return this.prisma.storeCustomer.findMany({
      where: { storeId },
      include: {
        customer: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByCustomer(customerId: string): Promise<StoreCustomer[]> {
    return this.prisma.storeCustomer.findMany({
      where: { customerId },
      include: {
        store: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(storeId: string, customerId: string): Promise<StoreCustomer> {
    return this.prisma.storeCustomer.create({
      data: {
        storeId,
        customerId,
      },
    });
  }

  async updateStatus(
    storeId: string,
    customerId: string,
    status: StoreCustomerStatus
  ): Promise<StoreCustomer> {
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
        approvedAt: status === StoreCustomerStatus.APPROVED ? now : null,
        blockedAt: status === StoreCustomerStatus.BLOCKED ? now : null,
      },
    });
  }

  async approve(storeId: string, customerId: string): Promise<StoreCustomer> {
    return this.updateStatus(storeId, customerId, StoreCustomerStatus.APPROVED);
  }

  async block(storeId: string, customerId: string): Promise<StoreCustomer> {
    return this.updateStatus(storeId, customerId, StoreCustomerStatus.BLOCKED);
  }

  async deactivate(storeId: string, customerId: string): Promise<StoreCustomer> {
    return this.updateStatus(storeId, customerId, StoreCustomerStatus.INACTIVE);
  }

  async reactivate(storeId: string, customerId: string): Promise<StoreCustomer> {
    return this.updateStatus(storeId, customerId, StoreCustomerStatus.PENDING);
  }

  async deleteByStoreAndCustomer(storeId: string, customerId: string): Promise<void> {
    await this.prisma.storeCustomer.delete({
      where: {
        storeId_customerId: {
          storeId,
          customerId,
        },
      },
    });
  }

  async exists(storeId: string, customerId: string): Promise<boolean> {
    const storeCustomer = await this.prisma.storeCustomer.findFirst({
      where: {
        storeId,
        customerId,
      },
    });
    return !!storeCustomer;
  }
}
