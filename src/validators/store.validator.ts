import { z } from 'zod';
import { StoreStatus } from '@prisma/client';

export const createStoreSchema = z.object({
  name: z.string().min(1).max(255),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
      message: 'Slug must contain only lowercase letters, numbers and hyphens',
    }),
  description: z.string().max(500).optional(),
  phone: z.string().max(20).optional(),
  timezone: z.string().default('America/Sao_Paulo'),
  currency: z.string().length(3).default('BRL'),
  evolutionInstanceId: z.string().max(100).optional(),
});

export const updateStoreSchema = createStoreSchema.partial();

export const storeStatusSchema = z.nativeEnum(StoreStatus);

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
