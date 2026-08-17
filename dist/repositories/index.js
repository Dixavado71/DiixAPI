import { getPrismaClient } from '../config/database';
import { StoreRepository } from './store.repository';
import { StoreSettingsRepository } from './store-settings.repository';
import { CustomerRepository } from './customer.repository';
import { StoreCustomerRepository } from './store-customer.repository';
// Singleton instances
let storeRepository = null;
let storeSettingsRepository = null;
let customerRepository = null;
let storeCustomerRepository = null;
export function getStoreRepository() {
    if (!storeRepository) {
        storeRepository = new StoreRepository(getPrismaClient());
    }
    return storeRepository;
}
export function getStoreSettingsRepository() {
    if (!storeSettingsRepository) {
        storeSettingsRepository = new StoreSettingsRepository(getPrismaClient());
    }
    return storeSettingsRepository;
}
export function getCustomerRepository() {
    if (!customerRepository) {
        customerRepository = new CustomerRepository(getPrismaClient());
    }
    return customerRepository;
}
export function getStoreCustomerRepository() {
    if (!storeCustomerRepository) {
        storeCustomerRepository = new StoreCustomerRepository(getPrismaClient());
    }
    return storeCustomerRepository;
}
//# sourceMappingURL=index.js.map