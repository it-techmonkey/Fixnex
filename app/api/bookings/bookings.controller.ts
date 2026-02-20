import { NextRequest, NextResponse } from "next/server";
import { BookingsService } from "./bookings.service";
import { CartService } from "../cart/cart.service";
import { BookingCartItemService } from "../booking-cart-items/bookingCartItem.service";
import { BookingStatus } from "@prisma/client";

type CreateRequestBody = {
  bookingCartItemIds?: string[];
  userId?: string | null;
  categoryName?: string | null;
  location?: string | null;
  serviceType?: string | null;
  scheduledDate?: string | null;
  timeSlot?: string | null;
  price?: string | null;
  status?: BookingStatus | null;
};

export class BookingsController {
  constructor(
    private readonly service = new BookingsService(),
    private readonly cartService = new CartService(),
    private readonly bookingCartItemService = new BookingCartItemService()
  ) {}

  async list(request: NextRequest) {
    try {
      const filters = this.parseListFilters(request);
      const { bookings, total } = await this.service.getAllBookings(filters);
      const totalPages = Math.max(1, Math.ceil(total / filters.pageSize));

      return NextResponse.json(
        {
          message: "Bookings fetched successfully.",
          bookings,
          pagination: {
            total,
            page: filters.page,
            pageSize: filters.pageSize,
            totalPages,
          },
        },
        { status: 200 }
      );
    } catch (error) {
      console.error("List bookings error:", error);
      return NextResponse.json(
        { message: "Unable to fetch bookings right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async listByUser(_request: NextRequest, userId: string) {
    try {
      if (!userId) {
        return NextResponse.json({ message: "User ID is required." }, { status: 400 });
      }

      const bookings = await this.service.getBookingsByUserId(userId);
      return NextResponse.json(
        { message: "Bookings fetched successfully.", bookings },
        { status: 200 }
      );
    } catch (error) {
      console.error("List user bookings error:", error);
      return NextResponse.json(
        { message: "Unable to fetch user bookings right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async detail(_request: NextRequest, id: string) {
    try {
      if (!id) {
        return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
      }

      const booking = await this.service.getBookingById(id);
      if (!booking) {
        return NextResponse.json({ message: "Booking not found." }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Booking fetched successfully.", booking },
        { status: 200 }
      );
    } catch (error) {
      console.error("Get booking error:", error);
      return NextResponse.json(
        { message: "Unable to fetch the booking right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async create(request: NextRequest) {
    try {
      const body = (await request.json()) as CreateRequestBody;

      const bookingCartItemIds = this.normalizeIds(body.bookingCartItemIds);
      if (bookingCartItemIds.length === 0) {
        return NextResponse.json(
          { message: "At least one bookingCartItemId is required." },
          { status: 400 }
        );
      }

      const items = await this.bookingCartItemService.getByIds(bookingCartItemIds);
      if (items.length === 0) {
        return NextResponse.json(
          { message: "No booking cart items were found for the provided IDs." },
          { status: 404 }
        );
      }

      const missingIds = bookingCartItemIds.filter((id) => !items.some((item) => item.id === id));
      if (missingIds.length > 0) {
        return NextResponse.json(
          { message: "Some booking cart items were not found.", missingIds },
          { status: 404 }
        );
      }

      const alreadyBooked = items.filter((item) => item.booking_id);
      if (alreadyBooked.length > 0) {
        return NextResponse.json(
          {
            message: "One or more booking cart items are already linked to a booking.",
            bookedItemIds: alreadyBooked.map((item) => item.id),
          },
          { status: 400 }
        );
      }

      const uniqueCartIds = new Set(items.map((item) => item.cart?.id).filter(Boolean));
      if (uniqueCartIds.size > 1) {
        return NextResponse.json(
          { message: "All booking cart items must belong to the same cart." },
          { status: 400 }
        );
      }

      const resolvedUserIdFromItems =
        items.find((item) => item.cart?.user_id)?.cart?.user_id ?? null;
      const requestedUserId = this.normalizeOptionalString(body.userId);

      if (requestedUserId && resolvedUserIdFromItems && requestedUserId !== resolvedUserIdFromItems) {
        return NextResponse.json(
          { message: "Provided user does not match the owner of the booking cart items." },
          { status: 400 }
        );
      }

      const userId = requestedUserId ?? resolvedUserIdFromItems ?? null;

      const aggregatedCategoryName =
        this.normalizeOptionalString(body.categoryName) ??
        this.pickFirstString(items.map((item) => item.category_name));
      const aggregatedLocation =
        this.normalizeOptionalString(body.location) ??
        this.pickFirstString(items.map((item) => item.location));
      const aggregatedServiceType =
        this.normalizeOptionalString(body.serviceType) ??
        this.pickFirstString(items.map((item) => item.service_type));
      const aggregatedTimeSlot =
        this.normalizeOptionalString(body.timeSlot) ??
        this.pickFirstString(items.map((item) => item.time_slot));
      const aggregatedScheduledDate =
        this.normalizeOptionalString(body.scheduledDate) ??
        this.pickFirstString(
          items.map((item) => (item.scheduled_date ? item.scheduled_date.toISOString() : null))
        );

      const explicitPrice = this.normalizeOptionalString(body.price);
      const numericPrices = items
        .map((item) => (item.price ? Number.parseFloat(item.price) : Number.NaN))
        .filter((value) => Number.isFinite(value)) as number[];

      const aggregatedPrice =
        explicitPrice ??
        (numericPrices.length === items.filter((item) => item.price).length && numericPrices.length > 0
          ? numericPrices.reduce((sum, value) => sum + value, 0).toFixed(2)
          : this.pickFirstString(items.map((item) => item.price)));

      const booking = await this.service.createBooking({
        bookingCartItemIds,
        userId,
        categoryName: aggregatedCategoryName,
        location: aggregatedLocation,
        serviceType: aggregatedServiceType,
        scheduledDate: aggregatedScheduledDate,
        timeSlot: aggregatedTimeSlot,
        price: aggregatedPrice,
      });

      if (userId) {
        try {
          await this.cartService.clearCart(userId);
        } catch (error) {
          console.error("Failed to clear cart after booking:", error);
        }
      }

      return NextResponse.json(
        { message: "Booking created successfully.", booking },
        { status: 201 }
      );
    } catch (error) {
      console.error("Create booking error:", error);
      return NextResponse.json(
        { message: "Unable to create the booking right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async update(request: NextRequest, id: string) {
    try {
      if (!id) {
        return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
      }

      const body = (await request.json()) as Partial<CreateRequestBody>;

      // Validate status if provided
      let validatedStatus: BookingStatus | undefined = undefined;
      if (body.status !== undefined && body.status !== null) {
        const upperStatus = String(body.status).toUpperCase();
        if (Object.values(BookingStatus).includes(upperStatus as BookingStatus)) {
          validatedStatus = upperStatus as BookingStatus;
        } else {
          return NextResponse.json(
            { message: `Invalid status. Must be one of: ${Object.values(BookingStatus).join(", ")}` },
            { status: 400 }
          );
        }
      }

      const booking = await this.service.updateBooking(id, {
        bookingCartItemIds: body.bookingCartItemIds,
        userId: body.userId,
        categoryName: body.categoryName,
        location: body.location,
        serviceType: body.serviceType,
        scheduledDate: body.scheduledDate,
        timeSlot: body.timeSlot,
        price: body.price,
        status: validatedStatus,
      });

      return NextResponse.json(
        { message: "Booking updated successfully.", booking },
        { status: 200 }
      );
    } catch (error) {
      console.error("Update booking error:", error);
      if ((error as { code?: string }).code === "P2025") {
        return NextResponse.json({ message: "Booking not found." }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Unable to update the booking right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async remove(_request: NextRequest, id: string) {
    try {
      if (!id) {
        return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
      }

      await this.service.deleteBooking(id);

      return NextResponse.json({ message: "Booking deleted successfully." }, { status: 200 });
    } catch (error) {
      console.error("Delete booking error:", error);
      if ((error as { code?: string }).code === "P2025") {
        return NextResponse.json({ message: "Booking not found." }, { status: 404 });
      }

      return NextResponse.json(
        { message: "Unable to delete the booking right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  private parseListFilters(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;

    const page = this.parsePositiveInteger(searchParams.get("page"), 1);
    const pageSize = this.parsePositiveInteger(searchParams.get("pageSize"), 10, 1, 100);

    const dateRange = this.extractDateRange(searchParams);

    const userName = this.normalizeOptionalString(
      searchParams.get("userName") ?? searchParams.get("name")
    );
    const location = this.normalizeOptionalString(searchParams.get("location"));
    const serviceType = this.normalizeOptionalString(searchParams.get("serviceType"));
    const categoryName = this.normalizeOptionalString(searchParams.get("categoryName"));
    const status = this.extractStatus(searchParams.get("status"));
    const search = this.normalizeOptionalString(
      searchParams.get("search") ?? searchParams.get("q")
    );

    return {
      scheduledDateFrom: dateRange?.from ?? null,
      scheduledDateTo: dateRange?.to ?? null,
      userName,
      location,
      serviceType,
      categoryName,
      status,
      searchTerm: search,
      page,
      pageSize,
    };
  }

  private parsePositiveInteger(
    value: string | null,
    fallback: number,
    min = 1,
    max = Number.POSITIVE_INFINITY
  ) {
    const parsed = Number.parseInt(value ?? "", 10);
    if (Number.isNaN(parsed)) {
      return fallback;
    }

    return Math.min(Math.max(parsed, min), max);
  }

  private extractDateRange(searchParams: URLSearchParams) {
    const specificDate = this.parseDate(searchParams.get("date"));
    if (specificDate) {
      const start = this.startOfDay(specificDate);
      return { from: start, to: this.addDays(start, 1) };
    }

    const startDate = this.parseDate(searchParams.get("startDate"));
    const endDate = this.parseDate(searchParams.get("endDate"));

    if (!startDate && !endDate) {
      return null;
    }

    const from = startDate ? this.startOfDay(startDate) : undefined;
    const to = endDate ? this.addDays(this.startOfDay(endDate), 1) : undefined;

    if (from && to && to <= from) {
      return { from, to: this.addDays(from, 1) };
    }

    return { from: from ?? null, to: to ?? null };
  }

  private parseDate(raw: string | null) {
    if (!raw) {
      return null;
    }

    const parsed = new Date(raw);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  private startOfDay(date: Date) {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy;
  }

  private addDays(date: Date, count: number) {
    const copy = new Date(date);
    copy.setDate(copy.getDate() + count);
    return copy;
  }

  private extractStatus(raw: string | null) {
    const normalized = this.normalizeOptionalString(raw);
    if (!normalized) {
      return null;
    }

    const upper = normalized.toUpperCase();
    return Object.values(BookingStatus).includes(upper as BookingStatus)
      ? (upper as BookingStatus)
      : null;
  }

  private normalizeOptionalString(value?: string | null) {
    return typeof value === "string" ? value.trim() || null : null;
  }

  private normalizeIds(ids?: string[]) {
    if (!Array.isArray(ids)) {
      return [];
    }

    return ids
      .map((id) => (typeof id === "string" ? id.trim() : ""))
      .filter((id) => id.length > 0);
  }

  private pickFirstString(values: Array<string | null | undefined>) {
    for (const value of values) {
      if (typeof value === "string" && value.trim().length > 0) {
        return value.trim();
      }
    }
    return null;
  }
}

