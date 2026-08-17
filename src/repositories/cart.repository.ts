import { PrismaClient, Cart, CartItem } from '@prisma/client';

export class CartRepository {
  private prisma: PrismaClient;

  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  async findActiveCart(storeId: string, customerId: string): Promise<Cart | null> {
    return this.prisma.cart.findFirst({
      where: {
        storeId,
        customerId,
        status: 'ACTIVE',
      },
    });
  }

  async getCartItems(cartId: string): Promise<CartItem[]> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { cartId },
    });
    return cartItems;
  }

  async getOrCreateCart(storeId: string, customerId: string) {
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

  async findById(id: string) {
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

  async addItem(cartId: string, productId: string, quantity: number) {
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

  async updateItem(itemId: string, quantity: number) {
    return this.prisma.cartItem.update({
      where: { id: itemId },
      data: { quantity },
    });
  }

  async removeItem(itemId: string) {
    return this.prisma.cartItem.delete({
      where: { id: itemId },
    });
  }

  async clearCart(cartId: string) {
    return this.prisma.cartItem.deleteMany({
      where: { cartId },
    });
  }

  async updateStatus(cartId: string, status: 'ACTIVE' | 'ABANDONED' | 'CONVERTED') {
    return this.prisma.cart.update({
      where: { id: cartId },
      data: { status },
    });
  }
}
