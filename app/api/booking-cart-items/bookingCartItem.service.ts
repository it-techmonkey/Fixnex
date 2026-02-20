import { prisma } from "@/lib/prisma";

type CreateBookingCartItemPayload = {
  cartId: string;
  serviceId: string;
  categoryName?: string | null;
  location?: string | null;
  serviceType?: string | null;
  scheduledDate?: string | null;
  timeSlot?: string | null;
  price?: string | null;
};

export class BookingCartItemService {
  async getAll() {
    return prisma.bookingCartItem.findMany({
      where: {
        booking_id: null,
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
        cart: {
          select: {
            id: true,
            user_id: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getByIds(ids: string[]) {
    if (ids.length === 0) {
      return [];
    }

    return prisma.bookingCartItem.findMany({
      where: {
        id: {
          in: ids,
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
        cart: {
          select: {
            id: true,
            user_id: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async create(payload: CreateBookingCartItemPayload) {
    const {
      cartId,
      serviceId,
      categoryName,
      location,
      serviceType,
      scheduledDate,
      timeSlot,
      price,
    } = payload;

    return prisma.bookingCartItem.create({
      data: {
        cart: {
          connect: {
            id: cartId,
          },
        },
        services: {
          connect: {
            id: serviceId,
          },
        },
        category_name: categoryName ?? null,
        location: location ?? null,
        service_type: serviceType ?? null,
        scheduled_date: scheduledDate ? new Date(scheduledDate) : null,
        time_slot: timeSlot ?? null,
        price: price ?? null,
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
        cart: {
          select: {
            id: true,
            user_id: true,
          },
        },
      },
    });
  }

  async deleteById(id: string) {
    return prisma.bookingCartItem.delete({
      where: { id },
    });
  }

  async deleteMany(ids: string[]) {
    if (ids.length === 0) {
      return;
    }

    await prisma.bookingCartItem.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });
  }

  async updateById(
    id: string,
    payload: {
      scheduledDate?: string | null;
      timeSlot?: string | null;
      location?: string | null;
      serviceType?: string | null;
      categoryName?: string | null;
      price?: string | null;
    }
  ) {
    const { scheduledDate, timeSlot, location, serviceType, categoryName, price } = payload;

    return prisma.bookingCartItem.update({
      where: { id },
      data: {
        ...(scheduledDate !== undefined
          ? { scheduled_date: scheduledDate ? new Date(scheduledDate) : null }
          : {}),
        ...(timeSlot !== undefined ? { time_slot: timeSlot ?? null } : {}),
        ...(location !== undefined ? { location: location ?? null } : {}),
        ...(serviceType !== undefined ? { service_type: serviceType ?? null } : {}),
        ...(categoryName !== undefined ? { category_name: categoryName ?? null } : {}),
        ...(price !== undefined ? { price: price ?? null } : {}),
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
        cart: {
          select: {
            id: true,
            user_id: true,
          },
        },
        booking: {
          select: {
            id: true,
          },
        },
      },
    });
  }
}

