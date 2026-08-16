import { PrismaClient, Store, StoreStatus } from '@prisma/client';
export declare class StoreRepository {
    private prisma;
    constructor(prisma: PrismaClient);
    findById(id: string): Promise<Store | null>;
    findBySlug(slug: string): Promise<Store | null>;
    findByEvolutionInstance(instanceName: string): Promise<Store | null>;
    findAll(): Promise<Store[]>;
    create(data: {
        name: string;
        slug: string;
        description?: string;
        phone?: string;
        timezone?: string;
        currency?: string;
        evolutionInstanceId?: string;
    }): Promise<Store>;
    update(id: string, data: {
        name?: string;
        slug?: string;
        description?: string;
        phone?: string;
        timezone?: string;
        currency?: string;
        evolutionInstanceId?: string;
    }): Promise<Store>;
    updateStatus(id: string, status: StoreStatus): Promise<Store>;
    activate(id: string): Promise<Store>;
    deactivate(id: string): Promise<Store>;
    suspend(id: string): Promise<Store>;
    existsBySlug(slug: string, excludeId?: string): Promise<boolean>;
    existsByEvolutionInstance(instanceName: string, excludeId?: string): Promise<boolean>;
}
//# sourceMappingURL=store.repository.d.ts.map