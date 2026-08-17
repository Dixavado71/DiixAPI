"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CartService = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
class CartService {
    async findByCustomerId(customerId) {
        return prisma.cart.findFirst({
            where: { customerId },
            include: { items: { include: { product: true } } },
        });
    }
    async create(customerId, storeId) {
        return prisma.cart.create({
            data: { customerId, storeId },
        });
    }
    async addItem(cartId, productId, quantity) {
        return prisma.cartItem.upsert({
            where: { cartId_productId: { cartId, productId } },
            update: { quantity: { increment: quantity } },
            create: { cartId, productId, quantity },
        });
    }
    async removeItem(cartId, productId) {
        await prisma.cartItem.delete({
            where: { cartId_productId: { cartId, productId } },
        });
    }
    async clear(cartId) {
        await prisma.cartItem.deleteMany({ where: { cartId } });
    }
    async getItems(cartId) {
        return prisma.cartItem.findMany({
            where: { cartId },
            include: { product: true },
        });
    }
}
exports.CartService = CartService;
//# sourceMappingURL=cart.service.js.map