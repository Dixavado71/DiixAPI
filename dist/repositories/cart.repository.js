export class CartRepository {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findActiveCart(storeId, customerId) {
        return this.prisma.cart.findFirst({
            where: {
                storeId,
                customerId,
                status: 'ACTIVE',
            },
        });
    }
    async getCartItems(cartId) {
        const cartItems = await this.prisma.cartItem.findMany({
            where: { cartId },
        });
        return cartItems;
    }
    async getOrCreateCart(storeId, customerId) {
        // Try to find active cart
        let cart = await this.prisma.cart.findFirst({
            where: {
                storeId,
                customerId,
                status: 'ACTIVE',
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });
        // Create if doesn't exist
        if (!cart) {
            cart = await this.prisma.cart.create({
                data: {
                    storeId,
                    customerId,
                    status: 'ACTIVE',
                },
                include: {
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            });
        }
        return cart;
    }
    async findById(id) {
        return this.prisma.cart.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                store: true,
            },
        });
    }
    async addItem(cartId, productId, quantity) {
        return this.prisma.cartItem.upsert({
            where: {
                cartId_productId: {
                    cartId,
                    productId,
                },
            },
            update: {
                quantity: {
                    increment: quantity,
                },
            },
            create: {
                cartId,
                productId,
                quantity,
            },
            include: {
                product: true,
            },
        });
    }
    async updateItem(itemId, quantity) {
        return this.prisma.cartItem.update({
            where: { id: itemId },
            data: { quantity },
        });
    }
    async removeItem(itemId) {
        return this.prisma.cartItem.delete({
            where: { id: itemId },
        });
    }
    async clearCart(cartId) {
        return this.prisma.cartItem.deleteMany({
            where: { cartId },
        });
    }
    async updateStatus(cartId, status) {
        return this.prisma.cart.update({
            where: { id: cartId },
            data: { status },
        });
    }
}
//# sourceMappingURL=cart.repository.js.map