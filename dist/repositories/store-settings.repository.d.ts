import { PrismaClient, StoreSettings } from '@prisma/client';
export declare class StoreSettingsRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findByStoreId(storeId: string): Promise<StoreSettings | null>;
    create(storeId: string, data?: Partial<StoreSettings>): Promise<StoreSettings>;
    update(storeId: string, data: Partial<StoreSettings>): Promise<StoreSettings>;
    upsert(storeId: string, data: Partial<StoreSettings>): Promise<StoreSettings>;
    deleteByStoreId(storeId: string): Promise<void>;
}
//# sourceMappingURL=store-settings.repository.d.ts.map