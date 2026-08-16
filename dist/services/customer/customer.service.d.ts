import { StoreCustomer } from '@prisma/client';
import { CreateCustomerInput, UpdateCustomerInput } from '../../validators/customer.validator';
export declare class CustomerService {
    private customerRepository;
    private storeCustomerRepository;
    findAll(): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    }[]>;
    findById(id: string): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    } | null>;
    findByPhone(phone: string): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    } | null>;
    create(data: CreateCustomerInput): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    }>;
    update(id: string, data: UpdateCustomerInput): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    }>;
    activate(id: string): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    }>;
    deactivate(id: string): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    }>;
    block(id: string): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    }>;
    unblock(id: string): Promise<{
        name: string | null;
        status: import(".prisma/client").$Enums.CustomerStatus;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        phone: string;
        email: string | null;
    }>;
    registerInStore(storeId: string, customerId: string): Promise<StoreCustomer>;
    approveInStore(storeId: string, customerId: string): Promise<StoreCustomer>;
    blockInStore(storeId: string, customerId: string): Promise<StoreCustomer>;
    removeFromStore(storeId: string, customerId: string): Promise<void>;
    getStoreCustomers(storeId: string): Promise<StoreCustomer[]>;
    getCustomerStores(customerId: string): Promise<StoreCustomer[]>;
}
//# sourceMappingURL=customer.service.d.ts.map