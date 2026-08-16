import { Store, StoreSettings, Customer, StoreCustomer, StoreCustomerStatus, StoreStatus, CustomerStatus } from '@prisma/client';
import { getStoreRepository, getCustomerRepository, getStoreCustomerRepository, getStoreSettingsRepository } from '../../repositories';
import { normalizePhone } from '../../utils/phone';
import { getLogger } from '../../utils/logger';

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
export class CustomerAuthorizationService {
  private storeRepository = getStoreRepository();
  private customerRepository = getCustomerRepository();
  private storeCustomerRepository = getStoreCustomerRepository();
  private settingsRepository = getStoreSettingsRepository();

  /**
   * Check if a customer is allowed to interact with a store
   * 
   * Rules:
   * 1. Store must be ACTIVE
   * 2. If customerRegistrationRequired is true, customer must be registered in the store
   * 3. If customerApprovalRequired is true, customer must have APPROVED status
   * 4. Customer cannot be BLOCKED at global or store level
   */
  async isCustomerAllowed(
    storeId: string,
    customerId: string
  ): Promise<AuthorizationResult> {
    // Load store
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      return {
        allowed: false,
        reason: 'STORE_NOT_FOUND',
      };
    }

    // Check store status
    if (store.status !== StoreStatus.ACTIVE) {
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
    if (customer.status === CustomerStatus.BLOCKED) {
      return {
        allowed: false,
        reason: 'CUSTOMER_BLOCKED',
        store,
        settings,
        customer,
      };
    }

    if (customer.status === CustomerStatus.INACTIVE) {
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
      const storeCustomer = await this.storeCustomerRepository.findByStoreAndCustomer(
        storeId,
        customerId
      );

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
      if (storeCustomer.status === StoreCustomerStatus.BLOCKED) {
        return {
          allowed: false,
          reason: 'CUSTOMER_BLOCKED_IN_STORE',
          store,
          settings,
          customer,
          storeCustomer,
        };
      }

      if (storeCustomer.status === StoreCustomerStatus.INACTIVE) {
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
        if (storeCustomer.status !== StoreCustomerStatus.APPROVED) {
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
  async isCustomerAllowedByPhone(
    storeId: string,
    phone: string
  ): Promise<AuthorizationResult> {
    const normalizedPhone = normalizePhone(phone);
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

  private async getStoreSettings(storeId: string): Promise<StoreSettings> {
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
