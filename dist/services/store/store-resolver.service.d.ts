import { Store } from '@prisma/client';
/**
 * StoreResolverService
 *
 * Resolves a store from various identifiers, primarily from Evolution API instance names.
 */
export declare class StoreResolverService {
    private storeRepository;
    /**
     * Resolve store from Evolution API instance name
     */
    resolveByInstance(instanceName: string): Promise<Store | null>;
    /**
     * Resolve store by ID
     */
    resolveById(storeId: string): Promise<Store | null>;
    /**
     * Resolve store by slug
     */
    resolveBySlug(slug: string): Promise<Store | null>;
}
//# sourceMappingURL=store-resolver.service.d.ts.map