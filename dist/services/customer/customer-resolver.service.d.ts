import { Customer, StoreCustomer } from '@prisma/client';
export interface CustomerResolutionResult {
    customer: Customer | null;
    storeCustomer: StoreCustomer | null;
    isNewCustomer: boolean;
}
/**
 * CustomerResolverService
 *
 * Resolves a customer from phone number and their relationship with a store.
 */
export declare class CustomerResolverService {
    private customerRepository;
    private storeCustomerRepository;
    /**
     * Resolve customer by phone number
     */
    resolveByPhone(phone: string): Promise<Customer | null>;
    /**
     * Resolve customer by ID
     */
    resolveById(customerId: string): Promise<Customer | null>;
    /**
     * Resolve customer and their store relationship
     */
    resolveWithStoreRelationship(storeId: string, phone: string): Promise<CustomerResolutionResult>;
    /**
     * Find or create customer by phone
     * Use with caution - only when customer registration is not required
     */
    findOrCreateByPhone(phone: string, name?: string): Promise<Customer>;
}
//# sourceMappingURL=customer-resolver.service.d.ts.map