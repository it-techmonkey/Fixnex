import { NextRequest, NextResponse } from "next/server";
import { BookingCartItemService } from "./bookingCartItem.service";
import { BookingsService } from "../bookings/bookings.service";
import { CartService } from "../cart/cart.service";

type CreateRequestBody = {
  cartId?: string;
  serviceId?: string;
  categoryName?: string | null;
  location?: string | null;
  serviceType?: string | null;
  scheduledDate?: string | null;
  timeSlot?: string | null;
  price?: string | null;
};

type CreateBookingFromItemsBody = {
  bookingCartItemIds?: string[];
  userId?: string | null;
};

type UpdateRequestBody = {
  scheduledDate?: string | null;
  timeSlot?: string | null;
  location?: string | null;
  serviceType?: string | null;
  categoryName?: string | null;
  price?: string | null;
};

export class BookingCartItemController {
  constructor(
    private readonly service = new BookingCartItemService(),
    private readonly bookingsService = new BookingsService(),
    private readonly cartService = new CartService()
  ) {}

  async list(_request: NextRequest) {
    try {
      const items = await this.service.getAll();
      return NextResponse.json(
        { message: "Booking cart items fetched successfully.", items },
        { status: 200 }
      );
    } catch (error) {
      console.error("List booking cart items error:", error);
      return NextResponse.json(
        { message: "Unable to fetch booking cart items right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async create(request: NextRequest) {
    try {
      const body = (await request.json()) as CreateRequestBody;

      const cartId = typeof body.cartId === "string" ? body.cartId.trim() : "";
      const serviceId = typeof body.serviceId === "string" ? body.serviceId.trim() : "";
      const categoryName = this.normalizeOptionalString(body.categoryName);
      const location = this.normalizeOptionalString(body.location);
      const serviceType = this.normalizeOptionalString(body.serviceType);
      const scheduledDate = this.normalizeOptionalString(body.scheduledDate);
      const timeSlot = this.normalizeOptionalString(body.timeSlot);
      const price = this.normalizeOptionalString(body.price);

      if (!cartId || !serviceId) {
        return NextResponse.json(
          { message: "cartId and serviceId are required." },
          { status: 400 }
        );
      }

      const item = await this.service.create({
        cartId,
        serviceId,
        categoryName,
        location,
        serviceType,
        scheduledDate,
        timeSlot,
        price,
      });

      return NextResponse.json(
        { message: "Booking cart item created successfully.", item },
        { status: 201 }
      );
    } catch (error) {
      console.error("Create booking cart item error:", error);
      return NextResponse.json(
        { message: "Unable to create booking cart item right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async delete(_request: NextRequest, itemId: string) {
    try {
      const normalizedId = typeof itemId === "string" ? itemId.trim() : "";
      if (!normalizedId) {
        return NextResponse.json({ message: "Booking cart item ID is required." }, { status: 400 });
      }

      await this.service.deleteById(normalizedId);

      return NextResponse.json(
        { message: "Booking cart item deleted successfully." },
        { status: 200 }
      );
    } catch (error) {
      console.error("Delete booking cart item error:", error);
      return NextResponse.json(
        { message: "Unable to delete booking cart item right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async update(request: NextRequest, itemId: string) {
    try {
      const normalizedId = typeof itemId === "string" ? itemId.trim() : "";
      if (!normalizedId) {
        return NextResponse.json({ message: "Booking cart item ID is required." }, { status: 400 });
      }

      const body = (await request.json()) as UpdateRequestBody;

      const normalizedPayload = {
        scheduledDate: this.normalizeOptionalString(body.scheduledDate),
        timeSlot: this.normalizeOptionalString(body.timeSlot),
        location: this.normalizeOptionalString(body.location),
        serviceType: this.normalizeOptionalString(body.serviceType),
        categoryName: this.normalizeOptionalString(body.categoryName),
        price: this.normalizeOptionalString(body.price),
      };

      const updated = await this.service.updateById(normalizedId, normalizedPayload);

      return NextResponse.json(
        { message: "Booking cart item updated successfully.", item: updated },
        { status: 200 }
      );
    } catch (error) {
      console.error("Update booking cart item error:", error);
      if ((error as { code?: string }).code === "P2025") {
        return NextResponse.json({ message: "Booking cart item not found." }, { status: 404 });
      }
      return NextResponse.json(
        { message: "Unable to update booking cart item right now. Please try again later." },
        { status: 500 }
      );
    }
  }

  async createBookingFromItems(request: NextRequest) {
    try {
      const body = (await request.json()) as CreateBookingFromItemsBody;
      const itemIds = this.normalizeIds(body?.bookingCartItemIds);

      if (itemIds.length === 0) {
        return NextResponse.json(
          { message: "At least one booking cart item ID is required." },
          { status: 400 }
        );
      }

      const items = await this.service.getByIds(itemIds);
      if (items.length === 0) {
        return NextResponse.json(
          { message: "No booking cart items were found for the provided IDs." },
          { status: 404 }
        );
      }

      const missingIds = itemIds.filter((id) => !items.some((item) => item.id === id));
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
      const requestedUserId = this.normalizeOptionalString(body?.userId);

      if (requestedUserId && resolvedUserIdFromItems && requestedUserId !== resolvedUserIdFromItems) {
        return NextResponse.json(
          { message: "Provided user does not match the owner of the booking cart items." },
          { status: 400 }
        );
      }

      const userId = requestedUserId ?? resolvedUserIdFromItems ?? null;

      const aggregatedCategoryName = this.pickFirstString(items.map((item) => item.category_name));
      const aggregatedLocation = this.pickFirstString(items.map((item) => item.location));
      const aggregatedServiceType = this.pickFirstString(items.map((item) => item.service_type));
      const aggregatedTimeSlot = this.pickFirstString(items.map((item) => item.time_slot));
      const aggregatedScheduledDate = this.pickFirstString(
        items.map((item) => (item.scheduled_date ? item.scheduled_date.toISOString() : null))
      );

      const numericPrices = items
        .map((item) => (item.price ? Number.parseFloat(item.price) : Number.NaN))
        .filter((value) => Number.isFinite(value)) as number[];

      const aggregatedPrice =
        numericPrices.length === items.filter((item) => item.price).length && numericPrices.length > 0
          ? numericPrices.reduce((sum, value) => sum + value, 0).toFixed(2)
          : this.pickFirstString(items.map((item) => item.price));

      const booking = await this.bookingsService.createBooking({
        bookingCartItemIds: itemIds,
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
          console.error("Failed to clear cart after booking creation:", error);
        }
      }

      return NextResponse.json(
        { message: "Booking created successfully from cart items.", booking },
        { status: 201 }
      );
    } catch (error) {
      console.error("Create booking from cart items error:", error);
      return NextResponse.json(
        { message: "Unable to create booking from cart items right now. Please try again later." },
        { status: 500 }
      );
    }
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

