import { StoreSettings } from '@prisma/client';
import { CreateStoreInput, UpdateStoreInput } from '../../validators/store.validator';
import { UpdateStoreSettingsInput } from '../../validators/store-settings.validator';
export declare class StoreService {
    private storeRepository;
    private settingsRepository;
    findAll(): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    }[]>;
    findById(id: string): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    } | null>;
    findBySlug(slug: string): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    } | null>;
    findByEvolutionInstance(instanceName: string): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    } | null>;
    create(data: CreateStoreInput): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    }>;
    update(id: string, data: UpdateStoreInput): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    }>;
    activate(id: string): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    }>;
    deactivate(id: string): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    }>;
    suspend(id: string): Promise<{
        name: string;
        status: import(".prisma/client").$Enums.StoreStatus;
        id: string;
        createdAt: Date;
        phone: string | null;
        updatedAt: Date;
        description: string | null;
        slug: string;
        timezone: string;
        currency: string;
        evolutionInstanceId: string | null;
    }>;
    getSettings(storeId: string): Promise<StoreSettings>;
    updateSettings(storeId: string, data: UpdateStoreSettingsInput): Promise<StoreSettings>;
}
//# sourceMappingURL=store.service.d.ts.map