"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.customerStatusSchema = exports.updateCustomerSchema = exports.createCustomerSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.createCustomerSchema = zod_1.z.object({
    name: zod_1.z.string().min(1).max(255).optional(),
    phone: zod_1.z.string().min(10).max(20),
    email: zod_1.z.string().email().max(255).optional(),
});
exports.updateCustomerSchema = exports.createCustomerSchema.partial();
exports.customerStatusSchema = zod_1.z.nativeEnum(client_1.CustomerStatus);
//# sourceMappingURL=customer.validator.js.map