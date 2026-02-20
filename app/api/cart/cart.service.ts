import { prisma } from "@/lib/prisma";

const createUserNotFoundError = () =>
  Object.assign(new Error("USER_NOT_FOUND"), { code: "USER_NOT_FOUND" });

export class CartService {
  async getCartByUserId(userId: string) {
    return prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            normal_price: true,
            member_price: true,
            icon: true,
          },
        },
      },
    });
  }

  async updateCart(userId: string, serviceIds: string[]) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw createUserNotFoundError();
    }

    return prisma.cart.upsert({
      where: { user_id: userId },
      update: {
        services: {
          set: serviceIds.map((id) => ({ id })),
        },
      },
      create: {
        user: {
          connect: { id: userId },
        },
        services: {
          connect: serviceIds.map((id) => ({ id })),
        },
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            normal_price: true,
            member_price: true,
            icon: true,
          },
        },
      },
    });
  }

  async clearCart(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw createUserNotFoundError();
    }

    return prisma.cart.upsert({
      where: { user_id: userId },
      update: {
        services: {
          set: [],
        },
      },
      create: {
        user: {
          connect: { id: userId },
        },
        services: {
          connect: [],
        },
      },
      include: {
        services: {
          select: {
            id: true,
            name: true,
            normal_price: true,
            member_price: true,
            icon: true,
          },
        },
      },
    });
  }
}

