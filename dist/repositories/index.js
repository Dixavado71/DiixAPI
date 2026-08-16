"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStoreRepository = getStoreRepository;
exports.getStoreSettingsRepository = getStoreSettingsRepository;
exports.getCustomerRepository = getCustomerRepository;
exports.getStoreCustomerRepository = getStoreCustomerRepository;
const database_1 = require("../config/database");
const store_repository_1 = require("./store.repository");
const store_settings_repository_1 = require("./store-settings.repository");
const customer_repository_1 = require("./customer.repository");
const store_customer_repository_1 = require("./store-customer.repository");
// Singleton instances
let storeRepository = null;
let storeSettingsRepository = null;
let customerRepository = null;
let storeCustomerRepository = null;
function getStoreRepository() {
    if (!storeRepository) {
        storeRepository = new store_repository_1.StoreRepository((0, database_1.getPrismaClient)());
    }
    return storeRepository;
}
function getStoreSettingsRepository() {
    if (!storeSettingsRepository) {
        storeSettingsRepository = new store_settings_repository_1.StoreSettingsRepository((0, database_1.getPrismaClient)());
    }
    return storeSettingsRepository;
}
function getCustomerRepository() {
    if (!customerRepository) {
        customerRepository = new customer_repository_1.CustomerRepository((0, database_1.getPrismaClient)());
    }
    return customerRepository;
}
function getStoreCustomerRepository() {
    if (!storeCustomerRepository) {
        storeCustomerRepository = new store_customer_repository_1.StoreCustomerRepository((0, database_1.getPrismaClient)());
    }
    return storeCustomerRepository;
}
//# sourceMappingURL=index.js.map