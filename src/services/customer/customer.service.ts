import { Customer, StoreCustomer } from '@prisma/client';
import { getCustomerRepository, getStoreCustomerRepository } from '../../repositories';
import { CreateCustomerInput, UpdateCustomerInput } from '../../validators/customer.validator';
import { normalizePhone } from '../../utils/phone';
import { getLogger } from '../../utils/logger';

const logger = getLogger().child({ module: 'customer-service' });

export class CustomerService {
  private customerRepository = getCustomerRepository();
  private storeCustomerRepository = getStoreCustomerRepository();

  async findAll() {
    return this.customerRepository.findAll();
  }

  async findById(id: string) {
    return this.customerRepository.findById(id);
  }

  async findByPhone(phone: string) {
    const normalizedPhone = normalizePhone(phone);
    return this.customerRepository.findByPhone(normalizedPhone);
  }

  async create(data: CreateCustomerInput) {
    // Normalize phone number
    const normalizedPhone = normalizePhone(data.phone);

    // Check if customer already exists with this phone
    const existingCustomer = await this.customerRepository.findByPhone(normalizedPhone);
    if (existingCustomer) {
      throw new Error('CUSTOMER_ALREADY_EXISTS');
    }

    const customer = await this.customerRepository.create({
      ...data,
      phone: normalizedPhone,
    });

    logger.info({ customerId: customer.id, phone: normalizedPhone }, 'Customer created');
    return customer;
  }

  async update(id: string, data: UpdateCustomerInput) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    // Normalize phone if provided
    if (data.phone) {
      const normalizedPhone = normalizePhone(data.phone);
      
      // Check if another customer already has this phone
      const existingCustomer = await this.customerRepository.findByPhone(normalizedPhone);
      if (existingCustomer && existingCustomer.id !== id) {
        throw new Error('CUSTOMER_ALREADY_EXISTS');
      }
      
      data.phone = normalizedPhone;
    }

    const updatedCustomer = await this.customerRepository.update(id, data);
    logger.info({ customerId: id }, 'Customer updated');
    return updatedCustomer;
  }

  async activate(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    const updatedCustomer = await this.customerRepository.activate(id);
    logger.info({ customerId: id }, 'Customer activated');
    return updatedCustomer;
  }

  async deactivate(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    const updatedCustomer = await this.customerRepository.deactivate(id);
    logger.info({ customerId: id }, 'Customer deactivated');
    return updatedCustomer;
  }

  async block(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    const updatedCustomer = await this.customerRepository.block(id);
    logger.info({ customerId: id }, 'Customer blocked');
    return updatedCustomer;
  }

  async unblock(id: string) {
    const customer = await this.customerRepository.findById(id);
    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    const updatedCustomer = await this.customerRepository.unblock(id);
    logger.info({ customerId: id }, 'Customer unblocked');
    return updatedCustomer;
  }

  async registerInStore(storeId: string, customerId: string): Promise<StoreCustomer> {
    // Verify customer exists
    const customer = await this.customerRepository.findById(customerId);
    if (!customer) {
      throw new Error('CUSTOMER_NOT_FOUND');
    }

    // Check if already registered
    const existing = await this.storeCustomerRepository.exists(storeId, customerId);
    if (existing) {
      throw new Error('CUSTOMER_ALREADY_REGISTERED');
    }

    const storeCustomer = await this.storeCustomerRepository.create(storeId, customerId);
    logger.info({ storeId, customerId }, 'Customer registered in store');
    return storeCustomer;
  }

  async approveInStore(storeId: string, customerId: string): Promise<StoreCustomer> {
    const storeCustomer = await this.storeCustomerRepository.findByStoreAndCustomer(
      storeId,
      customerId
    );
    if (!storeCustomer) {
      throw new Error('STORE_CUSTOMER_NOT_FOUND');
    }

    const updated = await this.storeCustomerRepository.approve(storeId, customerId);
    logger.info({ storeId, customerId }, 'Customer approved in store');
    return updated;
  }

  async blockInStore(storeId: string, customerId: string): Promise<StoreCustomer> {
    const storeCustomer = await this.storeCustomerRepository.findByStoreAndCustomer(
      storeId,
      customerId
    );
    if (!storeCustomer) {
      throw new Error('STORE_CUSTOMER_NOT_FOUND');
    }

    const updated = await this.storeCustomerRepository.block(storeId, customerId);
    logger.info({ storeId, customerId }, 'Customer blocked in store');
    return updated;
  }

  async removeFromStore(storeId: string, customerId: string): Promise<void> {
    const storeCustomer = await this.storeCustomerRepository.findByStoreAndCustomer(
      storeId,
      customerId
    );
    if (!storeCustomer) {
      throw new Error('STORE_CUSTOMER_NOT_FOUND');
    }

    await this.storeCustomerRepository.deleteByStoreAndCustomer(storeId, customerId);
    logger.info({ storeId, customerId }, 'Customer removed from store');
  }

  async getStoreCustomers(storeId: string): Promise<StoreCustomer[]> {
    return this.storeCustomerRepository.findByStore(storeId);
  }

  async getCustomerStores(customerId: string): Promise<StoreCustomer[]> {
    return this.storeCustomerRepository.findByCustomer(customerId);
  }
}
