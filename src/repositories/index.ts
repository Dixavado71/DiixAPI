import { getPrismaClient } from '../config/database';
import { StoreRepository } from './store.repository';
import { StoreSettingsRepository } from './store-settings.repository';
import { CustomerRepository } from './customer.repository';
import { StoreCustomerRepository } from './store-customer.repository';

// Singleton instances
let storeRepository: StoreRepository | null = null;
let storeSettingsRepository: StoreSettingsRepository | null = null;
let customerRepository: CustomerRepository | null = null;
let storeCustomerRepository: StoreCustomerRepository | null = null;

export function getStoreRepository(): StoreRepository {
  if (!storeRepository) {
    storeRepository = new StoreRepository(getPrismaClient());
  }
  return storeRepository;
}

export function getStoreSettingsRepository(): StoreSettingsRepository {
  if (!storeSettingsRepository) {
    storeSettingsRepository = new StoreSettingsRepository(getPrismaClient());
  }
  return storeSettingsRepository;
}

export function getCustomerRepository(): CustomerRepository {
  if (!customerRepository) {
    customerRepository = new CustomerRepository(getPrismaClient());
  }
  return customerRepository;
}

export function getStoreCustomerRepository(): StoreCustomerRepository {
  if (!storeCustomerRepository) {
    storeCustomerRepository = new StoreCustomerRepository(getPrismaClient());
  }
  return storeCustomerRepository;
}
