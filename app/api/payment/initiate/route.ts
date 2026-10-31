import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { getVerifiedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { BookingCartItemService } from "@/app/api/booking-cart-items/bookingCartItem.service";
import { generateBookingCode } from "@/lib/readableIds";
import {
  lockCustomerPlans,
  quoteBooking,
  toStoredPricing,
  type BookingQuote,
  type PropertyScope,
} from "@/lib/membership";
import { PLAN_NAMES, formatPlanDate } from "@/lib/plans";
import { sendIncludedBookingEmail } from "@/lib/planEmails";
import { GATEWAY_NOT_CONFIGURED_MESSAGE, buildGatewayCheckout, gatewayConfigured } from "@/lib/gatewayCheckout";

const bookingCartItemService = new BookingCartItemService();

class InitiateError extends Error {
  constructor(message: string, public status = 400, public extra: Record<string, unknown> = {}) {
    super(message);
  }
}

type CartItemWithService = Prisma.BookingCartItemGetPayload<{
  include: { services: { select: { name: true; normal_price: true; member_price: true } } };
}>;

export async function POST(request: NextRequest) {
  try {
    // 1. Parse body
    const body = (await request.json()) as {
      bookingCartItemIds?: unknown;
      custom_link_id?: string;
      guestDetails?: { name: string; email: string; phone: string };
      guestCartItems?: any[];
      propertyScope?: PropertyScope;
      /** Total the customer saw; if prices changed since, they are shown the new prices first. */
      expectedTotal?: number;
    };

    // 2. Verify session (ONLY REQUIRED IF NOT A CUSTOM LINK AND NOT GUEST)
    const verifiedUser = await getVerifiedUser(request);
    const session = verifiedUser ? { userId: verifiedUser.id } : null;
    if (!body.custom_link_id && !session && !body.guestDetails) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let totalAmount = "0.00";
    let paymentOrderData: Prisma.PaymentOrderUncheckedCreateInput = {
      user_id: session?.userId || null,
      currency: "AED",
      amount: "0.00",
    };

    if (body.custom_link_id) {
      // HANDLE CUSTOM PAYMENT LINK
      if (!gatewayConfigured()) {
        return NextResponse.json({ message: GATEWAY_NOT_CONFIGURED_MESSAGE }, { status: 503 });
      }
      const customLink = await prisma.customPaymentLink.findUnique({
        where: { id: body.custom_link_id },
      });

      if (!customLink) {
        return NextResponse.json({ message: "Custom payment link not found." }, { status: 404 });
      }

      if (customLink.status !== "PENDING") {
        return NextResponse.json({ message: "This payment has already been completed or cancelled." }, { status: 400 });
      }

      totalAmount = Number(customLink.amount).toFixed(2);
      paymentOrderData.custom_payment_link_id = customLink.id;
      paymentOrderData.amount = totalAmount;
      // A plan link belongs to a customer; record it so the payment shows under them.
      const planUserId = (customLink.plan_request as { userId?: string } | null)?.userId;
      if (planUserId) paymentOrderData.user_id = planUserId;
    } else {
      // HANDLE STANDARD CART CHECKOUT
      const bookingCartItemIds = await resolveCartItems(body, session?.userId ?? null);

      // Work out prices and either confirm a fully-included booking or create the payment order.
      // The customer's plan is locked while this runs so the same visit can't be used twice.
      const outcome = await prisma.$transaction(
        async (tx) => {
          if (session) await lockCustomerPlans(tx, session.userId);
          const items = (await tx.bookingCartItem.findMany({
            where: { id: { in: bookingCartItemIds } },
            include: { services: { select: { name: true, normal_price: true, member_price: true } } },
          })) as CartItemWithService[];
          if (items.some((item) => item.booking_id)) {
            throw new InitiateError("One or more items are already booked. Please refresh your cart.");
          }

          const quote = await quoteBooking(tx, {
            userId: session?.userId ?? null,
            items,
            propertyScope: body.propertyScope,
          });

          if (
            typeof body.expectedTotal === "number" &&
            Math.abs(body.expectedTotal - quote.total) >= 0.01
          ) {
            throw new InitiateError("Prices have changed. Please review your cart before continuing.", 409, {
              code: "PRICE_CHANGED",
              total: quote.total,
            });
          }

          if (quote.total <= 0) {
            // Nothing to pay: confirm the booking straight away (no payment page).
            if (!session) throw new InitiateError("Please log in to book this service.", 401);
            return { free: await createFreeBooking(tx, session.userId, items, quote) };
          }

          if (!gatewayConfigured()) throw new InitiateError(GATEWAY_NOT_CONFIGURED_MESSAGE, 503);
          const order = await tx.paymentOrder.create({
            data: {
              ...paymentOrderData,
              booking_cart_items: bookingCartItemIds,
              amount: quote.total.toFixed(2),
              purpose: "BOOKING",
              pricing: toStoredPricing(quote) as unknown as Prisma.InputJsonValue,
              included_visits: quote.includedVisits,
            },
          });
          return { order };
        },
        { timeout: 20000 }
      );

      if (outcome.free) {
        await afterFreeBooking(outcome.free, session!.userId);
        return NextResponse.json({
          confirmed: true,
          orderId: outcome.free.bookingCode,
          paymentStatus: outcome.free.paymentStatus,
        });
      }

      return NextResponse.json(
        await gatewayResponse(outcome.order!.id, outcome.order!.amount, body, session?.userId ?? null)
      );
    }

    // Custom payment link: create or reuse its PaymentOrder (temp record, status = PENDING)
    const existingOrder = await prisma.paymentOrder.findUnique({
      where: { custom_payment_link_id: body.custom_link_id },
    });
    const paymentOrder = existingOrder
      ? await prisma.paymentOrder.update({
          where: { id: existingOrder.id },
          data: { status: "PENDING", updated_at: new Date() },
        })
      : await prisma.paymentOrder.create({ data: paymentOrderData });

    return NextResponse.json(await gatewayResponse(paymentOrder.id, totalAmount, body, session?.userId ?? null));
  } catch (error) {
    if (error instanceof InitiateError) {
      return NextResponse.json({ message: error.message, ...error.extra }, { status: error.status });
    }
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { message: `Failed to initiate payment. ${(error as Error).message}` },
      { status: 500 }
    );
  }
}

/** Validates the cart (or creates guest cart items) and returns the item IDs to book. */
async function resolveCartItems(
  body: { bookingCartItemIds?: unknown; guestDetails?: unknown; guestCartItems?: any[] },
  userId: string | null
): Promise<string[]> {
  const isGuest = !userId && !!body.guestDetails && !!body.guestCartItems;

  if (isGuest) {
    if (!gatewayConfigured()) throw new InitiateError(GATEWAY_NOT_CONFIGURED_MESSAGE, 503);
    const guestItems = body.guestCartItems || [];
    if (guestItems.length === 0) throw new InitiateError("Guest cart is empty.");

    const ids: string[] = [];
    for (const gItem of guestItems) {
      const service = await prisma.service.findUnique({ where: { id: gItem.service_id } });
      if (!service) continue;
      const createdItem = await prisma.bookingCartItem.create({
        data: {
          service_id: service.id,
          category_name: gItem.category_name,
          location: gItem.location,
          service_type: gItem.service_type,
          scheduled_date: gItem.scheduled_date ? new Date(gItem.scheduled_date) : null,
          time_slot: gItem.time_slot,
          price: service.normal_price,
        },
      });
      ids.push(createdItem.id);
    }
    if (ids.length === 0) throw new InitiateError("Invalid guest cart items.");
    return ids;
  }

  const rawIds = body.bookingCartItemIds;
  if (!Array.isArray(rawIds) || rawIds.length === 0) {
    throw new InitiateError("bookingCartItemIds must be a non-empty array.");
  }
  const ids = rawIds
    .map((id) => (typeof id === "string" ? id.trim() : ""))
    .filter((id) => id.length > 0);
  if (ids.length === 0) throw new InitiateError("No valid bookingCartItemIds provided.");

  const items = await bookingCartItemService.getByIds(ids);
  if (items.length === 0) throw new InitiateError("No booking cart items found for the provided IDs.", 404);

  const missingIds = ids.filter((id: string) => !items.some((item: { id: string }) => item.id === id));
  if (missingIds.length > 0) {
    throw new InitiateError("Some booking cart items were not found.", 404, { missingIds });
  }
  const alreadyBooked = items.filter((item: { booking_id: string | null }) => item.booking_id);
  if (alreadyBooked.length > 0) {
    throw new InitiateError("One or more items are already linked to a booking.", 400, {
      bookedItemIds: alreadyBooked.map((i: { id: string }) => i.id),
    });
  }
  const unauthorized = items.filter(
    (item: { cart?: { user_id: string } | null }) => item.cart?.user_id !== userId
  );
  if (unauthorized.length > 0) throw new InitiateError("Access denied to one or more cart items.", 403);

  return ids;
}

type FreeBooking = {
  bookingId: string;
  bookingCode: string;
  paymentStatus: "INCLUDED" | "UNPAID";
  quote: BookingQuote;
  items: CartItemWithService[];
};

/**
 * Creates a booking that needs no online payment: every item is included in the plan, or the
 * service only has a custom quote (the team confirms the price, booking stays UNPAID).
 */
async function createFreeBooking(
  tx: Prisma.TransactionClient,
  userId: string,
  items: CartItemWithService[],
  quote: BookingQuote
): Promise<FreeBooking> {
  const allIncluded = quote.items.every((i) => i.coverage === "INCLUDED");
  const code = await generateBookingCode(tx, items.map((i) => i.services?.name));
  const first = items[0];

  const booking = await tx.booking.create({
    data: {
      booking_code: code,
      user_id: userId,
      category_name: first?.category_name ?? null,
      location: first?.location ?? null,
      service_type: first?.service_type ?? null,
      scheduled_date: first?.scheduled_date ?? null,
      time_slot: first?.time_slot ?? null,
      price: allIncluded ? "0.00" : quote.items.map((i) => i.priceText).filter(Boolean)[0] ?? "0.00",
      status: "PENDING",
      payment_status: allIncluded ? "INCLUDED" : "UNPAID",
      member_plan: quote.member?.plan ?? null,
      subscription_id: quote.member?.subscriptionId ?? null,
      property_scope: quote.propertyScope,
      is_priority: quote.priority,
    },
  });

  for (const q of quote.items) {
    await tx.bookingCartItem.update({
      where: { id: q.itemId },
      data: {
        booking_id: booking.id,
        price: q.priceText ?? q.price.toFixed(2),
        coverage: q.coverage,
        subscription_id: q.coverage === "INCLUDED" ? q.subscriptionId : null,
      },
    });
  }

  return {
    bookingId: booking.id,
    bookingCode: code,
    paymentStatus: allIncluded ? "INCLUDED" : "UNPAID",
    quote,
    items,
  };
}

/** Clears the cart and emails the customer. Never throws. */
async function afterFreeBooking(free: FreeBooking, userId: string) {
  try {
    await prisma.cart.update({ where: { user_id: userId }, data: { services: { set: [] } } });
  } catch (err) {
    console.error("Failed to clear cart after included booking:", err);
  }
  try {
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, fullName: true } });
    const first = free.items[0];
    if (user?.email && free.paymentStatus === "INCLUDED" && free.quote.member) {
      await sendIncludedBookingEmail({
        to: user.email,
        customerName: user.fullName || "there",
        bookingCode: free.bookingCode,
        planName: PLAN_NAMES[free.quote.member.plan],
        services: free.items.map((i) => i.services?.name ?? "Service"),
        date: formatPlanDate(first?.scheduled_date ?? null),
        timeSlot: first?.time_slot ?? "-",
        location: first?.location ?? "-",
      });
    }
  } catch (err) {
    console.error("Failed to send included booking email:", err);
  }
}

/** Billing details + encrypted CCAvenue request for the browser to post. */
async function gatewayResponse(
  orderId: string,
  amount: string,
  body: { custom_link_id?: string; guestDetails?: { name: string; email: string; phone: string } },
  userId: string | null
) {
  if (!gatewayConfigured()) throw new InitiateError(GATEWAY_NOT_CONFIGURED_MESSAGE, 503);

  let billing = { email: "guest@fixnex.ae", fullName: "Guest Customer", phone: "0000000000" };
  if (body.guestDetails) {
    billing = { email: body.guestDetails.email, fullName: body.guestDetails.name, phone: body.guestDetails.phone };
  } else if (userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true, phoneNumber: true },
    });
    if (user) {
      billing = { email: user.email, fullName: user.fullName || "Customer", phone: user.phoneNumber || "0000000000" };
    }
  } else if (body.custom_link_id) {
    const customLink = await prisma.customPaymentLink.findUnique({ where: { id: body.custom_link_id } });
    if (customLink?.customer_email) billing.email = customLink.customer_email;
  }

  return buildGatewayCheckout(orderId, amount, billing);
}
