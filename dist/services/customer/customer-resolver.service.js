"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerResolverService = void 0;
const repositories_1 = require("../../repositories");
const phone_1 = require("../../utils/phone");
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.getLogger)().child({ module: 'customer-resolver' });
/**
 * CustomerResolverService
 *
 * Resolves a customer from phone number and their relationship with a store.
 */
class CustomerResolverService {
    customerRepository = (0, repositories_1.getCustomerRepository)();
    storeCustomerRepository = (0, repositories_1.getStoreCustomerRepository)();
    /**
     * Resolve customer by phone number
     */
    async resolveByPhone(phone) {
        const normalizedPhone = (0, phone_1.normalizePhone)(phone);
        const customer = await this.customerRepository.findByPhone(normalizedPhone);
        if (customer) {
            logger.debug({ customerId: customer.id }, 'Customer resolved by phone');
        }
        else {
            logger.debug({ phone: normalizedPhone }, 'Customer not found by phone');
        }
        return customer;
    }
    /**
     * Resolve customer by ID
     */
    async resolveById(customerId) {
        return this.customerRepository.findById(customerId);
    }
    /**
     * Resolve customer and their store relationship
     */
    async resolveWithStoreRelationship(storeId, phone) {
        const normalizedPhone = (0, phone_1.normalizePhone)(phone);
        const customer = await this.customerRepository.findByPhone(normalizedPhone);
        if (!customer) {
            logger.debug({ phone: normalizedPhone }, 'Customer not found');
            return {
                customer: null,
                storeCustomer: null,
                isNewCustomer: true,
            };
        }
        const storeCustomer = await this.storeCustomerRepository.findByStoreAndCustomer(storeId, customer.id);
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
    async findOrCreateByPhone(phone, name) {
        const normalizedPhone = (0, phone_1.normalizePhone)(phone);
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
exports.CustomerResolverService = CustomerResolverService;
//# sourceMappingURL=customer-resolver.service.js.map