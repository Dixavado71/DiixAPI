import { z } from 'zod';
import { CustomerStatus } from '@prisma/client';
export const createCustomerSchema = z.object({
    name: z.string().min(1).max(255).optional(),
    phone: z.string().min(10).max(20),
    email: z.string().email().max(255).optional(),
});
export const updateCustomerSchema = createCustomerSchema.partial();
export const customerStatusSchema = z.nativeEnum(CustomerStatus);
//# sourceMappingURL=customer.validator.js.map