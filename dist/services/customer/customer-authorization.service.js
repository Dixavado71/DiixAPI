"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerAuthorizationService = void 0;
const client_1 = require("@prisma/client");
const repositories_1 = require("../../repositories");
const phone_1 = require("../../utils/phone");
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.getLogger)().child({ module: 'customer-authorization' });
/**
 * CustomerAuthorizationService
 *
 * Central service for determining if a customer is allowed to interact with a store.
 * This is critical for multi-tenant security and access control.
 */
class CustomerAuthorizationService {
    storeRepository = (0, repositories_1.getStoreRepository)();
    customerRepository = (0, repositories_1.getCustomerRepository)();
    storeCustomerRepository = (0, repositories_1.getStoreCustomerRepository)();
    settingsRepository = (0, repositories_1.getStoreSettingsRepository)();
    /**
     * Check if a customer is allowed to interact with a store
     *
     * Rules:
     * 1. Store must be ACTIVE
     * 2. If customerRegistrationRequired is true, customer must be registered in the store
     * 3. If customerApprovalRequired is true, customer must have APPROVED status
     * 4. Customer cannot be BLOCKED at global or store level
     */
    async isCustomerAllowed(storeId, customerId) {
        // Load store
        const store = await this.storeRepository.findById(storeId);
        if (!store) {
            return {
                allowed: false,
                reason: 'STORE_NOT_FOUND',
            };
        }
        // Check store status
        if (store.status !== client_1.StoreStatus.ACTIVE) {
            return {
                allowed: false,
                reason: 'STORE_INACTIVE',
                store,
            };
        }
        // Load store settings
        const settings = await this.getStoreSettings(storeId);
        // Load customer
        const customer = await this.customerRepository.findById(customerId);
        if (!customer) {
            return {
                allowed: false,
                reason: 'CUSTOMER_NOT_FOUND',
                store,
                settings,
            };
        }
        // Check global customer status
        if (customer.status === client_1.CustomerStatus.BLOCKED) {
            return {
                allowed: false,
                reason: 'CUSTOMER_BLOCKED',
                store,
                settings,
                customer,
            };
        }
        if (customer.status === client_1.CustomerStatus.INACTIVE) {
            return {
                allowed: false,
                reason: 'CUSTOMER_INACTIVE',
                store,
                settings,
                customer,
            };
        }
        // Check if registration is required
        if (settings.customerRegistrationRequired) {
            const storeCustomer = await this.storeCustomerRepository.findByStoreAndCustomer(storeId, customerId);
            if (!storeCustomer) {
                return {
                    allowed: false,
                    reason: 'CUSTOMER_NOT_REGISTERED',
                    store,
                    settings,
                    customer,
                };
            }
            // Check store-level customer status
            if (storeCustomer.status === client_1.StoreCustomerStatus.BLOCKED) {
                return {
                    allowed: false,
                    reason: 'CUSTOMER_BLOCKED_IN_STORE',
                    store,
                    settings,
                    customer,
                    storeCustomer,
                };
            }
            if (storeCustomer.status === client_1.StoreCustomerStatus.INACTIVE) {
                return {
                    allowed: false,
                    reason: 'CUSTOMER_INACTIVE_IN_STORE',
                    store,
                    settings,
                    customer,
                    storeCustomer,
                };
            }
            // Check if approval is required
            if (settings.customerApprovalRequired) {
                if (storeCustomer.status !== client_1.StoreCustomerStatus.APPROVED) {
                    return {
                        allowed: false,
                        reason: 'CUSTOMER_PENDING_APPROVAL',
                        store,
                        settings,
                        customer,
                        storeCustomer,
                    };
                }
            }
        }
        // All checks passed
        return {
            allowed: true,
            reason: 'AUTHORIZED',
            store,
            settings,
            customer,
        };
    }
    /**
     * Check if a customer is allowed based on phone number
     * Useful for WhatsApp webhook processing
     */
    async isCustomerAllowedByPhone(storeId, phone) {
        const normalizedPhone = (0, phone_1.normalizePhone)(phone);
        const customer = await this.customerRepository.findByPhone(normalizedPhone);
        if (!customer) {
            // Customer doesn't exist - check if registration is required
            const store = await this.storeRepository.findById(storeId);
            if (!store) {
                return {
                    allowed: false,
                    reason: 'STORE_NOT_FOUND',
                };
            }
            const settings = await this.getStoreSettings(storeId);
            if (settings.customerRegistrationRequired) {
                return {
                    allowed: false,
                    reason: 'CUSTOMER_NOT_REGISTERED',
                    store,
                    settings,
                };
            }
            // Registration not required - allow but customer will need to be created
            return {
                allowed: true,
                reason: 'NEW_CUSTOMER_ALLOWED',
                store,
                settings,
            };
        }
        return this.isCustomerAllowed(storeId, customer.id);
    }
    async getStoreSettings(storeId) {
        let storeSettings = await this.settingsRepository.findByStoreId(storeId);
        if (!storeSettings) {
            // Create default settings
            storeSettings = await this.settingsRepository.create(storeId, {
                commerceEnabled: true,
                customerRegistrationRequired: false,
                customerApprovalRequired: false,
                deliveryEnabled: true,
                pickupEnabled: false,
                pixEnabled: true,
                cashEnabled: true,
                cardEnabled: true,
                paymentOnDeliveryEnabled: true,
                botEnabled: true,
                supportEnabled: true,
                promotionEnabled: true,
            });
        }
        return storeSettings;
    }
}
exports.CustomerAuthorizationService = CustomerAuthorizationService;
//# sourceMappingURL=customer-authorization.service.js.map