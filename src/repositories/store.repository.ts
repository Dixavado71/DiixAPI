import { PrismaClient, Store, StoreStatus } from '@prisma/client';

export class StoreRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Store | null> {
    return this.prisma.store.findUnique({
      where: { id },
    });
  }

  async findBySlug(slug: string): Promise<Store | null> {
    return this.prisma.store.findUnique({
      where: { slug },
    });
  }

  async findByEvolutionInstance(instanceName: string): Promise<Store | null> {
    return this.prisma.store.findFirst({
      where: { evolutionInstanceId: instanceName },
    });
  }

  async findAll(): Promise<Store[]> {
    return this.prisma.store.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    slug: string;
    description?: string;
    phone?: string;
    timezone?: string;
    currency?: string;
    evolutionInstanceId?: string;
  }): Promise<Store> {
    return this.prisma.store.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      slug?: string;
      description?: string;
      phone?: string;
      timezone?: string;
      currency?: string;
      evolutionInstanceId?: string;
    }
  ): Promise<Store> {
    return this.prisma.store.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: StoreStatus): Promise<Store> {
    return this.prisma.store.update({
      where: { id },
      data: { status },
    });
  }

  async activate(id: string): Promise<Store> {
    return this.updateStatus(id, StoreStatus.ACTIVE);
  }

  async deactivate(id: string): Promise<Store> {
    return this.updateStatus(id, StoreStatus.INACTIVE);
  }

  async suspend(id: string): Promise<Store> {
    return this.updateStatus(id, StoreStatus.SUSPENDED);
  }

  async existsBySlug(slug: string, excludeId?: string): Promise<boolean> {
    const store = await this.prisma.store.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    return !!store;
  }

  async existsByEvolutionInstance(
    instanceName: string,
    excludeId?: string
  ): Promise<boolean> {
    const store = await this.prisma.store.findFirst({
      where: {
        evolutionInstanceId: instanceName,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    return !!store;
  }
}
