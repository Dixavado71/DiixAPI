import { z } from 'zod';
export declare const storeCustomerStatusSchema: z.ZodNativeEnum<{
    PENDING: "PENDING";
    APPROVED: "APPROVED";
    BLOCKED: "BLOCKED";
    INACTIVE: "INACTIVE";
}>;
export type StoreCustomerStatusInput = z.infer<typeof storeCustomerStatusSchema>;
//# sourceMappingURL=store-customer.validator.d.ts.map