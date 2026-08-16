import { z } from 'zod';

export const storeSettingsSchema = z.object({
  commerceEnabled: z.boolean().default(true),
  customerRegistrationRequired: z.boolean().default(false),
  customerApprovalRequired: z.boolean().default(false),
  deliveryEnabled: z.boolean().default(true),
  pickupEnabled: z.boolean().default(false),
  pixEnabled: z.boolean().default(true),
  cashEnabled: z.boolean().default(true),
  cardEnabled: z.boolean().default(true),
  paymentOnDeliveryEnabled: z.boolean().default(true),
  botEnabled: z.boolean().default(true),
  supportEnabled: z.boolean().default(true),
  promotionEnabled: z.boolean().default(true),
});

export const updateStoreSettingsSchema = storeSettingsSchema.partial();

export type StoreSettingsInput = z.infer<typeof storeSettingsSchema>;
export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;
