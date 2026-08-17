import { Customer, StoreCustomer } from '@prisma/client';
import { getCustomerRepository, getStoreCustomerRepository } from '../../repositories';
import { normalizePhone } from '../../utils/phone';
import { getLogger } from '../../utils/logger';

const logger = getLogger().child({ module: 'customer-resolver' });

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
export class CustomerResolverService {
  private customerRepository = getCustomerRepository();
  private storeCustomerRepository = getStoreCustomerRepository();

  /**
   * Resolve customer by phone number
   */
  async resolveByPhone(phone: string): Promise<Customer | null> {
    const normalizedPhone = normalizePhone(phone);
    const customer = await this.customerRepository.findByPhone(normalizedPhone);

    if (customer) {
      logger.debug({ customerId: customer.id }, 'Customer resolved by phone');
    } else {
      logger.debug({ phone: normalizedPhone }, 'Customer not found by phone');
    }

    return customer;
  }

  /**
   * Resolve customer by ID
   */
  async resolveById(customerId: string): Promise<Customer | null> {
    return this.customerRepository.findById(customerId);
  }

  /**
   * Resolve customer and their store relationship
   */
  async resolveWithStoreRelationship(
    storeId: string,
    phone: string
  ): Promise<CustomerResolutionResult> {
    const normalizedPhone = normalizePhone(phone);
    const customer = await this.customerRepository.findByPhone(normalizedPhone);

    if (!customer) {
      logger.debug({ phone: normalizedPhone }, 'Customer not found');
      return {
        customer: null,
        storeCustomer: null,
        isNewCustomer: true,
      };
    }

    const storeCustomer = await this.storeCustomerRepository.findByStoreAndCustomer(
      storeId,
      customer.id
    );

    return {
      customer,
      storeCustomer,
      isNewCustomer: !storeCustomer,
    };
  }

  /**
   * Find or create customer by phone
   * Use with caution - only when customer registration is not required
   */
  async findOrCreateByPhone(phone: string, name?: string): Promise<Customer> {
    const normalizedPhone = normalizePhone(phone);

    let customer = await this.customerRepository.findByPhone(normalizedPhone);

    if (customer) {
      logger.debug({ customerId: customer.id }, 'Existing customer found');
      return customer;
    }

    // Create new customer
    customer = await this.customerRepository.create({
      phone: normalizedPhone,
      name: name || undefined,
    });

    logger.info({ customerId: customer.id, phone: normalizedPhone }, 'New customer created');
    return customer;
  }
}
