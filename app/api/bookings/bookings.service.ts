import { prisma } from "@/lib/prisma";
import { BookingStatus, Prisma } from "@prisma/client";

type CreateBookingPayload = {
  userId?: string | null;
  categoryName?: string | null;
  location?: string | null;
  serviceType?: string | null;
  scheduledDate?: string | null;
  timeSlot?: string | null;
  price?: string | null;
  bookingCartItemIds?: string[];
  status?: BookingStatus | null;
};

type UpdateBookingPayload = Partial<CreateBookingPayload>;

export class BookingsService {
  async getAllBookings(options: {
    scheduledDateFrom?: Date | null;
    scheduledDateTo?: Date | null;
    userName?: string | null;
    location?: string | null;
    serviceType?: string | null;
    categoryName?: string | null;
    status?: BookingStatus | null;
    searchTerm?: string | null;
    page: number;
    pageSize: number;
  }) {
    const {
      scheduledDateFrom,
      scheduledDateTo,
      userName,
      location,
      serviceType,
      categoryName,
      status,
      searchTerm,
      page,
      pageSize,
    } = options;

    const where: Prisma.BookingWhereInput = {};

    if (scheduledDateFrom || scheduledDateTo) {
      where.scheduled_date = {
        ...(scheduledDateFrom ? { gte: scheduledDateFrom } : {}),
        ...(scheduledDateTo ? { lt: scheduledDateTo } : {}),
      };
    }

    if (userName) {
      where.user = {
        is: {
          fullName: {
            contains: userName,
            mode: "insensitive",
          },
        },
      };
    }

    if (location) {
      where.location = {
        contains: location,
        mode: "insensitive",
      };
    }

    if (serviceType) {
      where.service_type = {
        contains: serviceType,
        mode: "insensitive",
      };
    }

    if (categoryName) {
      where.category_name = {
        contains: categoryName,
        mode: "insensitive",
      };
    }

    if (status) {
      where.status = status;
    }

    if (searchTerm) {
      const orConditions: Prisma.BookingWhereInput[] = [
        {
          location: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          service_type: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          category_name: {
            contains: searchTerm,
            mode: "insensitive",
          },
        },
        {
          user: {
            is: {
              fullName: {
                contains: searchTerm,
                mode: "insensitive",
              },
            },
          },
        },
      ];

      const statusFromSearch = Object.values(BookingStatus).find(
        (variant) => variant.toUpperCase() === searchTerm.toUpperCase()
      );
      if (statusFromSearch) {
        orConditions.push({ status: statusFromSearch });
      }

      where.OR = [...(where.OR ?? []), ...orConditions];
    }

    const skip = (page - 1) * pageSize;

    const [total, bookings] = await prisma.$transaction([
      prisma.booking.count({ where }),
      prisma.booking.findMany({
        where,
        include: {
          bookingCartItems: {
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
          },
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
        orderBy: {
          created_at: "desc",
        },
        skip,
        take: pageSize,
      }),
    ]);

    return { bookings, total };
  }

  async getBookingsByUserId(userId: string) {
    return prisma.booking.findMany({
      where: { user_id: userId },
      include: {
        bookingCartItems: {
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
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });
  }

  async getBookingById(id: string) {
    return prisma.booking.findUnique({
      where: { id },
      include: {
        bookingCartItems: {
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
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async createBooking(payload: CreateBookingPayload) {
    const {
      bookingCartItemIds = [],
      userId,
      categoryName,
      location,
      serviceType,
      scheduledDate,
      timeSlot,
      price,
    } = payload;

    return prisma.$transaction(async (tx) => {
      const created = await tx.booking.create({
        data: {
          user_id: userId ?? null,
          category_name: categoryName ?? null,
          location: location ?? null,
          service_type: serviceType ?? null,
          scheduled_date: scheduledDate ? new Date(scheduledDate) : null,
          time_slot: timeSlot ?? null,
          price: price ?? null,
        },
      });

      if (bookingCartItemIds.length > 0) {
        await tx.bookingCartItem.updateMany({
          where: {
            id: {
              in: bookingCartItemIds,
            },
          },
          data: {
            booking_id: created.id,
          },
        });
      }

      return tx.booking.findUnique({
        where: { id: created.id },
        include: {
          bookingCartItems: {
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
          },
          user: {
            select: {
              id: true,
              email: true,
              fullName: true,
            },
          },
        },
      });
    });
  }

  async updateBooking(id: string, payload: UpdateBookingPayload) {
    const { bookingCartItemIds, ...fieldsToUpdate } = payload;

    // Only use transaction if we're updating bookingCartItemIds (multiple operations)
    // For simple field updates, avoid transaction to prevent timeout issues
    if (bookingCartItemIds !== undefined) {
      return prisma.$transaction(async (tx) => {
        const updated = await tx.booking.update({
          where: { id },
          data: this.buildBookingUpdateData(fieldsToUpdate),
        });

        await tx.bookingCartItem.updateMany({
          where: {
            booking_id: id,
            NOT: {
              id: {
                in: bookingCartItemIds,
              },
            },
          },
          data: {
            booking_id: null,
          },
        });

        if (bookingCartItemIds.length > 0) {
          await tx.bookingCartItem.updateMany({
            where: {
              id: {
                in: bookingCartItemIds,
              },
            },
            data: {
              booking_id: id,
            },
          });
        }

        return tx.booking.findUnique({
          where: { id: updated.id },
          include: {
            bookingCartItems: {
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
            },
            user: {
              select: {
                id: true,
                email: true,
                fullName: true,
              },
            },
          },
        });
      });
    }

    // Simple update without transaction for better performance
    const updated = await prisma.booking.update({
      where: { id },
      data: this.buildBookingUpdateData(fieldsToUpdate),
    });

    return prisma.booking.findUnique({
      where: { id: updated.id },
      include: {
        bookingCartItems: {
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
        },
        user: {
          select: {
            id: true,
            email: true,
            fullName: true,
          },
        },
      },
    });
  }

  async deleteBooking(id: string) {
    await prisma.booking.delete({
      where: { id },
    });
  }

  private buildBookingUpdateData(
    payload: Omit<UpdateBookingPayload, "bookingCartItemIds">
  ): Prisma.BookingUpdateInput {
    const { userId, categoryName, location, serviceType, scheduledDate, timeSlot, price, status } =
      payload;

    const bookingData: Prisma.BookingUpdateInput = {
      ...(categoryName !== undefined ? { category_name: categoryName } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(serviceType !== undefined ? { service_type: serviceType } : {}),
      ...(scheduledDate !== undefined
        ? { scheduled_date: scheduledDate ? new Date(scheduledDate) : null }
        : {}),
      ...(timeSlot !== undefined ? { time_slot: timeSlot } : {}),
      ...(price !== undefined ? { price } : {}),
      ...(status !== undefined && status !== null ? { status } : {}),
    };

    if (userId !== undefined) {
      bookingData.user =
        userId === null ? { disconnect: true } : { connect: { id: userId } };
    }

    return bookingData;
  }
}

