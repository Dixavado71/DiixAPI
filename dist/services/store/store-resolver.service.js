"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StoreResolverService = void 0;
const repositories_1 = require("../../repositories");
const logger_1 = require("../../utils/logger");
const logger = (0, logger_1.getLogger)().child({ module: 'store-resolver' });
/**
 * StoreResolverService
 *
 * Resolves a store from various identifiers, primarily from Evolution API instance names.
 */
class StoreResolverService {
    storeRepository = (0, repositories_1.getStoreRepository)();
    /**
     * Resolve store from Evolution API instance name
     */
    async resolveByInstance(instanceName) {
        if (!instanceName) {
            logger.warn('No instance name provided for store resolution');
            return null;
        }
        const store = await this.storeRepository.findByEvolutionInstance(instanceName);
        if (store) {
            logger.debug({ storeId: store.id, slug: store.slug }, 'Store resolved by instance');
        }
        else {
            logger.warn({ instanceName }, 'Store not found for instance');
        }
        return store;
    }
    /**
     * Resolve store by ID
     */
    async resolveById(storeId) {
        return this.storeRepository.findById(storeId);
    }
    /**
     * Resolve store by slug
     */
    async resolveBySlug(slug) {
        return this.storeRepository.findBySlug(slug);
    }
}
exports.StoreResolverService = StoreResolverService;
//# sourceMappingURL=store-resolver.service.js.map