"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStoreSettingsSchema = exports.storeSettingsSchema = void 0;
const zod_1 = require("zod");
exports.storeSettingsSchema = zod_1.z.object({
    commerceEnabled: zod_1.z.boolean().default(true),
    customerRegistrationRequired: zod_1.z.boolean().default(false),
    customerApprovalRequired: zod_1.z.boolean().default(false),
    deliveryEnabled: zod_1.z.boolean().default(true),
    pickupEnabled: zod_1.z.boolean().default(false),
    pixEnabled: zod_1.z.boolean().default(true),
    cashEnabled: zod_1.z.boolean().default(true),
    cardEnabled: zod_1.z.boolean().default(true),
    paymentOnDeliveryEnabled: zod_1.z.boolean().default(true),
    botEnabled: zod_1.z.boolean().default(true),
    supportEnabled: zod_1.z.boolean().default(true),
    promotionEnabled: zod_1.z.boolean().default(true),
});
exports.updateStoreSettingsSchema = exports.storeSettingsSchema.partial();
//# sourceMappingURL=store-settings.validator.js.map