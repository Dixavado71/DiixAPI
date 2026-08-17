import { PrismaClient, Customer, CustomerStatus } from '@prisma/client';

export class CustomerRepository {
  constructor(private prisma: PrismaClient) {}

  async findById(id: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { id },
    });
  }

  async findByPhone(phone: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { phone },
    });
  }

  async findAll(): Promise<Customer[]> {
    return this.prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: { name?: string; phone: string; email?: string }): Promise<Customer> {
    return this.prisma.customer.create({
      data,
    });
  }

  async update(
    id: string,
    data: {
      name?: string;
      phone?: string;
      email?: string;
    }
  ): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data,
    });
  }

  async updateStatus(id: string, status: CustomerStatus): Promise<Customer> {
    return this.prisma.customer.update({
      where: { id },
      data: { status },
    });
  }

  async activate(id: string): Promise<Customer> {
    return this.updateStatus(id, CustomerStatus.ACTIVE);
  }

  async deactivate(id: string): Promise<Customer> {
    return this.updateStatus(id, CustomerStatus.INACTIVE);
  }

  async block(id: string): Promise<Customer> {
    return this.updateStatus(id, CustomerStatus.BLOCKED);
  }

  async unblock(id: string): Promise<Customer> {
    return this.updateStatus(id, CustomerStatus.ACTIVE);
  }

  async existsByPhone(phone: string, excludeId?: string): Promise<boolean> {
    const customer = await this.prisma.customer.findFirst({
      where: {
        phone,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
    });
    return !!customer;
  }
}
