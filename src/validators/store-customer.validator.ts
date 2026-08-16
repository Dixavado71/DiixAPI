import { z } from 'zod';
import { StoreCustomerStatus } from '@prisma/client';

export const storeCustomerStatusSchema = z.nativeEnum(StoreCustomerStatus);

export type StoreCustomerStatusInput = z.infer<typeof storeCustomerStatusSchema>;
