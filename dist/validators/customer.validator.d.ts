import { z } from 'zod';
export declare const createCustomerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    phone: z.ZodString;
    email: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    phone: string;
    name?: string | undefined;
    email?: string | undefined;
}, {
    phone: string;
    name?: string | undefined;
    email?: string | undefined;
}>;
export declare const updateCustomerSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    phone: z.ZodOptional<z.ZodString>;
    email: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
}, {
    name?: string | undefined;
    phone?: string | undefined;
    email?: string | undefined;
}>;
export declare const customerStatusSchema: z.ZodNativeEnum<{
    ACTIVE: "ACTIVE";
    INACTIVE: "INACTIVE";
    BLOCKED: "BLOCKED";
}>;
export type CreateCustomerInput = z.infer<typeof createCustomerSchema>;
export type UpdateCustomerInput = z.infer<typeof updateCustomerSchema>;
//# sourceMappingURL=customer.validator.d.ts.map