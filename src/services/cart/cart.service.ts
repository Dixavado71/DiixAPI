import { PrismaClient } from '@prisma/client';
import type { Cart, CartItem } from '@prisma/client';

const prisma = new PrismaClient();

export class CartService {
  async findByCustomerId(customerId: string): Promise<Cart | null> {
    return prisma.cart.findFirst({
      where: { customerId },
      include: { items: { include: { product: true } } },
    });
  }

  async create(customerId: string, storeId: string): Promise<Cart> {
    return prisma.cart.create({
      data: { customerId, storeId },
    });
  }

  async addItem(cartId: string, productId: string, quantity: number): Promise<CartItem> {
    return prisma.cartItem.upsert({
      where: { cartId_productId: { cartId, productId } },
      update: { quantity: { increment: quantity } },
      create: { cartId, productId, quantity },
    });
  }

  async removeItem(cartId: string, productId: string): Promise<void> {
    await prisma.cartItem.delete({
      where: { cartId_productId: { cartId, productId } },
    });
  }

  async clear(cartId: string): Promise<void> {
    await prisma.cartItem.deleteMany({ where: { cartId } });
  }

  async getItems(cartId: string): Promise<CartItem[]> {
    return prisma.cartItem.findMany({
      where: { cartId },
      include: { product: true },
    });
  }
}
