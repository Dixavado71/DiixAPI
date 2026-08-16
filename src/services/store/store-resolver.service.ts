import { Store } from '@prisma/client';
import { getStoreRepository } from '../../repositories';
import { getLogger } from '../../utils/logger';

const logger = getLogger().child({ module: 'store-resolver' });

/**
 * StoreResolverService
 * 
 * Resolves a store from various identifiers, primarily from Evolution API instance names.
 */
export class StoreResolverService {
  private storeRepository = getStoreRepository();

  /**
   * Resolve store from Evolution API instance name
   */
  async resolveByInstance(instanceName: string): Promise<Store | null> {
    if (!instanceName) {
      logger.warn('No instance name provided for store resolution');
      return null;
    }

    const store = await this.storeRepository.findByEvolutionInstance(instanceName);
    
    if (store) {
      logger.debug({ storeId: store.id, slug: store.slug }, 'Store resolved by instance');
    } else {
      logger.warn({ instanceName }, 'Store not found for instance');
    }

    return store;
  }

  /**
   * Resolve store by ID
   */
  async resolveById(storeId: string): Promise<Store | null> {
    return this.storeRepository.findById(storeId);
  }

  /**
   * Resolve store by slug
   */
  async resolveBySlug(slug: string): Promise<Store | null> {
    return this.storeRepository.findBySlug(slug);
  }
}
