import { Store, StoreSettings, Customer, StoreCustomer } from '@prisma/client';
export interface AuthorizationResult {
    allowed: boolean;
    reason: string;
    store?: Store;
    settings?: StoreSettings;
    customer?: Customer;
    storeCustomer?: StoreCustomer;
}
/**
 * CustomerAuthorizationService
 *
 * Central service for determining if a customer is allowed to interact with a store.
 * This is critical for multi-tenant security and access control.
 */
export declare class CustomerAuthorizationService {
    private storeRepository;
    private customerRepository;
    private storeCustomerRepository;
    private settingsRepository;
    /**
     * Check if a customer is allowed to interact with a store
     *
     * Rules:
     * 1. Store must be ACTIVE
     * 2. If customerRegistrationRequired is true, customer must be registered in the store
     * 3. If customerApprovalRequired is true, customer must have APPROVED status
     * 4. Customer cannot be BLOCKED at global or store level
     */
    isCustomerAllowed(storeId: string, customerId: string): Promise<AuthorizationResult>;
    /**
     * Check if a customer is allowed based on phone number
     * Useful for WhatsApp webhook processing
     */
    isCustomerAllowedByPhone(storeId: string, phone: string): Promise<AuthorizationResult>;
    private getStoreSettings;
}
//# sourceMappingURL=customer-authorization.service.d.ts.map