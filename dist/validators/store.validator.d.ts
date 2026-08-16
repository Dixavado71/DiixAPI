import { z } from 'zod';
export declare const createStoreSchema: z.ZodObject<{
    name: z.ZodString;
    slug: z.ZodString;
    description: z.ZodOptional<z.ZodString>;
    phone: z.ZodOptional<z.ZodString>;
    timezone: z.ZodDefault<z.ZodString>;
    currency: z.ZodDefault<z.ZodString>;
    evolutionInstanceId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    slug: string;
    timezone: string;
    currency: string;
    description?: string | undefined;
    phone?: string | undefined;
    evolutionInstanceId?: string | undefined;
}, {
    name: string;
    slug: string;
    description?: string | undefined;
    phone?: string | undefined;
    timezone?: string | undefined;
    currency?: string | undefined;
    evolutionInstanceId?: string | undefined;
}>;
export declare const updateStoreSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    slug: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    timezone: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    currency: z.ZodOptional<z.ZodDefault<z.ZodString>>;
    evolutionInstanceId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    phone?: string | undefined;
    timezone?: string | undefined;
    currency?: string | undefined;
    evolutionInstanceId?: string | undefined;
}, {
    name?: string | undefined;
    description?: string | undefined;
    slug?: string | undefined;
    phone?: string | undefined;
    timezone?: string | undefined;
    currency?: string | undefined;
    evolutionInstanceId?: string | undefined;
}>;
export declare const storeStatusSchema: z.ZodNativeEnum<{
    ACTIVE: "ACTIVE";
    INACTIVE: "INACTIVE";
    SUSPENDED: "SUSPENDED";
}>;
export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
//# sourceMappingURL=store.validator.d.ts.map