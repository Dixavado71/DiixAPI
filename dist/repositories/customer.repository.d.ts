import { PrismaClient, Customer, CustomerStatus } from '@prisma/client';
export declare class CustomerRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<Customer | null>;
    findByPhone(phone: string): Promise<Customer | null>;
    findAll(): Promise<Customer[]>;
    create(data: {
        name?: string;
        phone: string;
        email?: string;
    }): Promise<Customer>;
    update(id: string, data: {
        name?: string;
        phone?: string;
        email?: string;
    }): Promise<Customer>;
    updateStatus(id: string, status: CustomerStatus): Promise<Customer>;
    activate(id: string): Promise<Customer>;
    deactivate(id: string): Promise<Customer>;
    block(id: string): Promise<Customer>;
    unblock(id: string): Promise<Customer>;
    existsByPhone(phone: string, excludeId?: string): Promise<boolean>;
}
//# sourceMappingURL=customer.repository.d.ts.map