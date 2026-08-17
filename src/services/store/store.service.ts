import { StoreSettings } from '@prisma/client';
import { getStoreRepository, getStoreSettingsRepository } from '../../repositories';
import { CreateStoreInput, UpdateStoreInput } from '../../validators/store.validator';
import { UpdateStoreSettingsInput } from '../../validators/store-settings.validator';
import { getLogger } from '../../utils/logger';

const logger = getLogger().child({ module: 'store-service' });

export class StoreService {
  private storeRepository = getStoreRepository();
  private settingsRepository = getStoreSettingsRepository();

  async findAll() {
    return this.storeRepository.findAll();
  }

  async findById(id: string) {
    return this.storeRepository.findById(id);
  }

  async findBySlug(slug: string) {
    return this.storeRepository.findBySlug(slug);
  }

  async findByEvolutionInstance(instanceName: string) {
    return this.storeRepository.findByEvolutionInstance(instanceName);
  }

  async create(data: CreateStoreInput) {
    // Check for slug uniqueness
    const slugExists = await this.storeRepository.existsBySlug(data.slug);
    if (slugExists) {
      throw new Error('STORE_ALREADY_EXISTS');
    }

    // Check for evolution instance uniqueness if provided
    if (data.evolutionInstanceId) {
      const instanceExists = await this.storeRepository.existsByEvolutionInstance(
        data.evolutionInstanceId
      );
      if (instanceExists) {
        throw new Error('EVOLUTION_INSTANCE_ALREADY_EXISTS');
      }
    }

    const store = await this.storeRepository.create(data);

    // Create default settings for the store
    await this.settingsRepository.create(store.id, {
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

    logger.info({ storeId: store.id, slug: store.slug }, 'Store created');
    return store;
  }

  async update(id: string, data: UpdateStoreInput) {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new Error('STORE_NOT_FOUND');
    }

    // Check for slug uniqueness if slug is being updated
    if (data.slug && data.slug !== store.slug) {
      const slugExists = await this.storeRepository.existsBySlug(data.slug, id);
      if (slugExists) {
        throw new Error('STORE_ALREADY_EXISTS');
      }
    }

    // Check for evolution instance uniqueness if being updated
    if (data.evolutionInstanceId && data.evolutionInstanceId !== store.evolutionInstanceId) {
      const instanceExists = await this.storeRepository.existsByEvolutionInstance(
        data.evolutionInstanceId,
        id
      );
      if (instanceExists) {
        throw new Error('EVOLUTION_INSTANCE_ALREADY_EXISTS');
      }
    }

    const updatedStore = await this.storeRepository.update(id, data);
    logger.info({ storeId: id }, 'Store updated');
    return updatedStore;
  }

  async activate(id: string) {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new Error('STORE_NOT_FOUND');
    }

    const updatedStore = await this.storeRepository.activate(id);
    logger.info({ storeId: id }, 'Store activated');
    return updatedStore;
  }

  async deactivate(id: string) {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new Error('STORE_NOT_FOUND');
    }

    const updatedStore = await this.storeRepository.deactivate(id);
    logger.info({ storeId: id }, 'Store deactivated');
    return updatedStore;
  }

  async suspend(id: string) {
    const store = await this.storeRepository.findById(id);
    if (!store) {
      throw new Error('STORE_NOT_FOUND');
    }

    const updatedStore = await this.storeRepository.suspend(id);
    logger.info({ storeId: id }, 'Store suspended');
    return updatedStore;
  }

  async getSettings(storeId: string): Promise<StoreSettings> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error('STORE_NOT_FOUND');
    }

    let settings = await this.settingsRepository.findByStoreId(storeId);

    // Create default settings if they don't exist
    if (!settings) {
      settings = await this.settingsRepository.create(storeId, {
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

    return settings;
  }

  async updateSettings(storeId: string, data: UpdateStoreSettingsInput): Promise<StoreSettings> {
    const store = await this.storeRepository.findById(storeId);
    if (!store) {
      throw new Error('STORE_NOT_FOUND');
    }

    const settings = await this.settingsRepository.upsert(storeId, data);
    logger.info({ storeId, settings }, 'Store settings updated');
    return settings;
  }
}
