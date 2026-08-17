import { PrismaClient, StoreSettings } from '@prisma/client';

export class StoreSettingsRepository {
  constructor(private prisma: PrismaClient) {}

  async findByStoreId(storeId: string): Promise<StoreSettings | null> {
    return this.prisma.storeSettings.findUnique({
      where: { storeId },
    });
  }

  async create(storeId: string, data: Partial<StoreSettings> = {}): Promise<StoreSettings> {
    return this.prisma.storeSettings.create({
      data: {
        storeId,
        ...data,
      },
    });
  }

  async update(storeId: string, data: Partial<StoreSettings>): Promise<StoreSettings> {
    return this.prisma.storeSettings.update({
      where: { storeId },
      data,
    });
  }

  async upsert(storeId: string, data: Partial<StoreSettings>): Promise<StoreSettings> {
    return this.prisma.storeSettings.upsert({
      where: { storeId },
      create: {
        storeId,
        ...data,
      },
      update: data,
    });
  }

  async deleteByStoreId(storeId: string): Promise<void> {
    await this.prisma.storeSettings.delete({
      where: { storeId },
    });
  }
}
