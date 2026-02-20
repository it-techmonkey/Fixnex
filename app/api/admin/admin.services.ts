import { prisma } from "@/lib/prisma";
import { BookingStatus } from "@prisma/client";

const ACTIVE_STATUSES: BookingStatus[] = [
  BookingStatus.PENDING,
  BookingStatus.CONFIRMED,
  BookingStatus.ONGOING,
];

const CANCELLED_STATUSES: BookingStatus[] = [BookingStatus.CANCELLED, BookingStatus.REJECTED];

const toNumeric = (value: string | null): number => {
  if (!value) {
    return 0;
  }

  const parsed = Number.parseFloat(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export class AdminService {
  constructor(private readonly client = prisma) {}

  async getDashboardMetrics() {
    const now = new Date();
    const last30Days = new Date(now);
    last30Days.setDate(last30Days.getDate() - 30);

    const last14DaysStart = new Date(now);
    last14DaysStart.setDate(last14DaysStart.getDate() - 13);
    last14DaysStart.setHours(0, 0, 0, 0);

    const [
      statusGroups,
      allBookingPrices,
      bookingsLast30Days,
      totalLinkedServices,
      categoriesGroup,
      serviceTypeGroup,
      uniqueServiceGroup,
      uniqueCustomerIds,
      recentBookings,
    ] = await Promise.all([
      this.client.booking.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
      this.client.booking.findMany({
        select: { price: true },
      }),
      this.client.booking.findMany({
        where: {
          created_at: {
            gte: last30Days,
          },
        },
        select: {
          id: true,
          created_at: true,
          price: true,
          status: true,
        },
      }),
      this.client.bookingCartItem.count({
        where: {
          booking_id: {
            not: null,
          },
        },
      }),
      this.client.bookingCartItem.groupBy({
        by: ["category_name"],
        where: {
          booking_id: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
      }),
      this.client.bookingCartItem.groupBy({
        by: ["service_type"],
        where: {
          booking_id: {
            not: null,
          },
        },
        _count: {
          _all: true,
        },
      }),
      this.client.bookingCartItem.groupBy({
        by: ["service_id"],
        where: {
          booking_id: {
            not: null,
          },
        },
      }),
      this.client.booking.findMany({
        where: {
          user_id: {
            not: null,
          },
        },
        select: {
          user_id: true,
        },
        distinct: ["user_id"],
      }),
      this.client.booking.findMany({
        orderBy: {
          created_at: "desc",
        },
        take: 5,
        select: {
          id: true,
          status: true,
          created_at: true,
          price: true,
          location: true,
          category_name: true,
        },
      }),
    ]);

    const totalBookings = statusGroups.reduce((sum, entry) => sum + entry._count._all, 0);
    const activeBookings = statusGroups
      .filter((entry) => ACTIVE_STATUSES.includes(entry.status as BookingStatus))
      .reduce((sum, entry) => sum + entry._count._all, 0);
    const completedBookings =
      statusGroups.find((entry) => entry.status === BookingStatus.COMPLETED)?._count._all ?? 0;
    const cancelledBookings = statusGroups
      .filter((entry) => CANCELLED_STATUSES.includes(entry.status as BookingStatus))
      .reduce((sum, entry) => sum + entry._count._all, 0);

    const totalRevenue = allBookingPrices.reduce(
      (sum, booking) => sum + toNumeric(booking.price),
      0
    );
    const bookingsWithPriceCount = allBookingPrices.filter(
      (booking) => toNumeric(booking.price) > 0
    ).length;

    const last30DaysRevenue = bookingsLast30Days.reduce(
      (sum, booking) => sum + toNumeric(booking.price),
      0
    );

    const newBookingsLast30Days = bookingsLast30Days.length;

    const trendMap = new Map<
      string,
      {
        count: number;
        revenue: number;
      }
    >();

    bookingsLast30Days.forEach((booking) => {
      const dateKey = booking.created_at.toISOString().slice(0, 10);
      const current = trendMap.get(dateKey) ?? { count: 0, revenue: 0 };
      current.count += 1;
      current.revenue += toNumeric(booking.price);
      trendMap.set(dateKey, current);
    });

    const last14DaysTrend: Array<{
      date: string;
      count: number;
      revenue: number;
    }> = [];

    for (let i = 0; i < 14; i += 1) {
      const day = new Date(last14DaysStart);
      day.setDate(last14DaysStart.getDate() + i);
      const dateKey = day.toISOString().slice(0, 10);
      const stats = trendMap.get(dateKey) ?? { count: 0, revenue: 0 };
      last14DaysTrend.push({
        date: dateKey,
        count: stats.count,
        revenue: Number(stats.revenue.toFixed(2)),
      });
    }

    const categoriesBreakdown = categoriesGroup
      .map((group) => ({
        name: group.category_name ?? "Uncategorised",
        count: group._count._all,
        percentage:
          totalLinkedServices === 0
            ? 0
            : Number(((group._count._all / totalLinkedServices) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const serviceTypeBreakdown = serviceTypeGroup
      .map((group) => ({
        name: group.service_type ?? "Other",
        count: group._count._all,
        percentage:
          totalLinkedServices === 0
            ? 0
            : Number(((group._count._all / totalLinkedServices) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    const uniqueCategoriesCount = new Set(
      categoriesGroup
        .map((group) => group.category_name?.trim())
        .filter((value): value is string => Boolean(value && value.length > 0))
    ).size;

    const uniqueCustomers = uniqueCustomerIds.filter(
      (entry) => typeof entry.user_id === "string"
    ).length;

    const statusDistribution = statusGroups
      .map((group) => ({
        status: group.status,
        count: group._count._all,
        percentage:
          totalBookings === 0
            ? 0
            : Number(((group._count._all / totalBookings) * 100).toFixed(1)),
      }))
      .sort((a, b) => b.count - a.count);

    const latestHighlights = recentBookings.map((booking) => ({
      id: booking.id,
      status: booking.status,
      createdAt: booking.created_at,
      price: toNumeric(booking.price).toFixed(2),
      location: booking.location,
      categoryName: booking.category_name,
    }));

    return {
      message: "Admin dashboard metrics generated successfully.",
      generatedAt: now.toISOString(),
      totals: {
        totalBookings,
        activeBookings,
        completedBookings,
        cancelledBookings,
        newBookingsLast30Days,
        uniqueCustomers,
      },
      revenue: {
        total: Number(totalRevenue.toFixed(2)),
        last30Days: Number(last30DaysRevenue.toFixed(2)),
        averagePerBooking:
          bookingsWithPriceCount === 0
            ? 0
            : Number((totalRevenue / bookingsWithPriceCount).toFixed(2)),
        completionRate:
          totalBookings === 0
            ? 0
            : Number(((completedBookings / totalBookings) * 100).toFixed(1)),
      },
      services: {
        totalLinkedServices,
        averageServicesPerBooking:
          totalBookings === 0 ? 0 : Number((totalLinkedServices / totalBookings).toFixed(2)),
        uniqueServices: uniqueServiceGroup.length,
        uniqueCategories: uniqueCategoriesCount,
        categoriesBreakdown,
        serviceTypeBreakdown,
      },
      bookingsTrend: {
        last14Days: last14DaysTrend,
        statusDistribution,
      },
      recentActivity: {
        latestBookings: latestHighlights,
      },
    };
  }

  async getTrendingServices(period: 'day' | 'week' | 'month' | 'year' = 'month') {
    const now = new Date();
    let startDate: Date;

    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(startDate.getFullYear() - 1);
        startDate.setHours(0, 0, 0, 0);
        break;
      default:
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        startDate.setHours(0, 0, 0, 0);
    }

    // Get all booking cart items with their services and bookings within the time period
    const bookingCartItems = await this.client.bookingCartItem.findMany({
      where: {
        booking: {
          created_at: {
            gte: startDate,
            lte: now,
          },
        },
      },
      include: {
        services: {
          include: {
            category: true,
          },
        },
        booking: {
          select: {
            id: true,
            created_at: true,
            status: true,
          },
        },
      },
    });

    // Group by service and count bookings
    type ServiceCount = {
      serviceId: string;
      serviceName: string;
      categoryName: string;
      icon: string;
      count: number;
      bookings: Array<{ id: string; created_at: Date; status: string }>;
    };

    const serviceCounts = new Map<string, ServiceCount>();

    for (const item of bookingCartItems) {
      if (!item.services) continue;

      const serviceId = item.services.id;
      const existing = serviceCounts.get(serviceId);

      if (existing) {
        existing.count += 1;
        if (item.booking) {
          existing.bookings.push({
            id: item.booking.id,
            created_at: item.booking.created_at,
            status: item.booking.status,
          });
        }
      } else {
        serviceCounts.set(serviceId, {
          serviceId: item.services.id,
          serviceName: item.services.name,
          categoryName: item.services.category.name,
          icon: item.services.icon,
          count: 1,
          bookings: item.booking
            ? [
                {
                  id: item.booking.id,
                  created_at: item.booking.created_at,
                  status: item.booking.status,
                },
              ]
            : [],
        });
      }
    }

    // Convert to array and sort by count (descending)
    const trendingServices = Array.from(serviceCounts.values())
      .map((service) => ({
        serviceId: service.serviceId,
        serviceName: service.serviceName,
        categoryName: service.categoryName,
        icon: service.icon,
        bookingCount: service.count,
        uniqueBookingCount: new Set(service.bookings.map((b) => b.id)).size,
      }))
      .sort((a, b) => b.bookingCount - a.bookingCount);

    return {
      period,
      startDate: startDate.toISOString(),
      endDate: now.toISOString(),
      totalServices: trendingServices.length,
      trendingServices,
    };
  }
}

