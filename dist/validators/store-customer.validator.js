"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.storeCustomerStatusSchema = void 0;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
exports.storeCustomerStatusSchema = zod_1.z.nativeEnum(client_1.StoreCustomerStatus);
//# sourceMappingURL=store-customer.validator.js.map