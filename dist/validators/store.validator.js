"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeStatusSchema = exports.updateStoreSchema = exports.createStoreSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createStoreSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255),
    slug: zod_1.z.string().min(1).max(100).regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, {
        message: 'Slug must contain only lowercase letters, numbers and hyphens',
    }),
    description: zod_1.z.string().max(500).optional(),
    phone: zod_1.z.string().max(20).optional(),
    timezone: zod_1.z.string().default('America/Sao_Paulo'),
    currency: zod_1.z.string().length(3).default('BRL'),
    evolutionInstanceId: zod_1.z.string().max(100).optional(),
});
exports.updateStoreSchema = exports.createStoreSchema.partial();
exports.storeStatusSchema = zod_1.z.nativeEnum(client_1.StoreStatus);
//# sourceMappingURL=store.validator.js.map