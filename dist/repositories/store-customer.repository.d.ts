import { PrismaClient, StoreCustomer, StoreCustomerStatus } from '@prisma/client';
export declare class StoreCustomerRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<StoreCustomer | null>;
    findByStoreAndCustomer(storeId: string, customerId: string): Promise<StoreCustomer | null>;
    findByStore(storeId: string): Promise<StoreCustomer[]>;
    findByCustomer(customerId: string): Promise<StoreCustomer[]>;
    create(storeId: string, customerId: string): Promise<StoreCustomer>;
    updateStatus(storeId: string, customerId: string, status: StoreCustomerStatus): Promise<StoreCustomer>;
    approve(storeId: string, customerId: string): Promise<StoreCustomer>;
    block(storeId: string, customerId: string): Promise<StoreCustomer>;
    deactivate(storeId: string, customerId: string): Promise<StoreCustomer>;
    reactivate(storeId: string, customerId: string): Promise<StoreCustomer>;
    deleteByStoreAndCustomer(storeId: string, customerId: string): Promise<void>;
    exists(storeId: string, customerId: string): Promise<boolean>;
}
//# sourceMappingURL=store-customer.repository.d.ts.map