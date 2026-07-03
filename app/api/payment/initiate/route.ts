import { NextRequest, NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { BookingCartItemService } from "@/app/api/booking-cart-items/bookingCartItem.service";
import { encrypt, getCCAvenueUrl, buildRequestParams } from "@/lib/ccavenue";

const bookingCartItemService = new BookingCartItemService();

export async function POST(request: NextRequest) {
  try {
    // 1. Validate CCAvenue credentials first — fail fast before any DB writes
    const merchantId = process.env.CCAVENUE_MERCHANT_ID;
    const accessCode = process.env.CCAVENUE_ACCESS_CODE;
    const workingKey = process.env.CCAVENUE_WORKING_KEY;

    if (!merchantId || !accessCode || !workingKey) {
      console.error(
        "CCAvenue credentials not configured. Set CCAVENUE_MERCHANT_ID, CCAVENUE_ACCESS_CODE, and CCAVENUE_WORKING_KEY in .env"
      );
      return NextResponse.json(
        {
          message:
            "Payment gateway is not configured yet. Please contact support or try again later.",
        },
        { status: 503 }
      );
    }

    // 2. Parse + validate body
    const body = (await request.json()) as { 
      bookingCartItemIds?: unknown; 
      custom_link_id?: string;
      guestDetails?: { name: string; email: string; phone: string };
      guestCartItems?: any[];
    };
    
    // 3. Verify session (ONLY REQUIRED IF NOT A CUSTOM LINK AND NOT GUEST)
    const session = getSessionFromRequest(request);
    if (!body.custom_link_id && !session && !body.guestDetails) {
      return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
    }

    let totalAmount = "0.00";
    let paymentOrderData: any = {
      user_id: session?.userId || null,
      currency: "AED",
    };

    if (body.custom_link_id) {
      // HANDLE CUSTOM PAYMENT LINK
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

    } else {
      // HANDLE STANDARD CART CHECKOUT
      let bookingCartItemIds: string[] = [];
      let items: any[] = [];
      const isGuest = !session && !!body.guestDetails && !!body.guestCartItems;

      if (isGuest) {
        const guestItems = body.guestCartItems || [];
        if (guestItems.length === 0) {
          return NextResponse.json({ message: "Guest cart is empty." }, { status: 400 });
        }

        // Generate BookingCartItems on the fly
        for (const gItem of guestItems) {
           const service = await prisma.service.findUnique({ where: { id: gItem.service_id } });
           if (!service) continue;
           
           const price = service.normal_price;
           
           const createdItem = await prisma.bookingCartItem.create({
             data: {
               service_id: service.id,
               category_name: gItem.category_name,
               location: gItem.location,
               service_type: gItem.service_type,
               scheduled_date: gItem.scheduled_date ? new Date(gItem.scheduled_date) : null,
               time_slot: gItem.time_slot,
               price: price,
             }
           });
           bookingCartItemIds.push(createdItem.id);
           items.push(createdItem);
        }

        if (bookingCartItemIds.length === 0) {
           return NextResponse.json({ message: "Invalid guest cart items." }, { status: 400 });
        }
      } else {
        const rawIds = body.bookingCartItemIds;

        if (!Array.isArray(rawIds) || rawIds.length === 0) {
          return NextResponse.json(
            { message: "bookingCartItemIds must be a non-empty array." },
            { status: 400 }
          );
        }

        bookingCartItemIds = rawIds
          .map((id) => (typeof id === "string" ? id.trim() : ""))
          .filter((id) => id.length > 0);

        if (bookingCartItemIds.length === 0) {
          return NextResponse.json(
            { message: "No valid bookingCartItemIds provided." },
            { status: 400 }
          );
        }

        // 4. Fetch and validate cart items
        items = await bookingCartItemService.getByIds(bookingCartItemIds);

        if (items.length === 0) {
          return NextResponse.json(
            { message: "No booking cart items found for the provided IDs." },
            { status: 404 }
          );
        }

        const missingIds = bookingCartItemIds.filter(
          (id: string) => !items.some((item: { id: string }) => item.id === id)
        );
        if (missingIds.length > 0) {
          return NextResponse.json(
            { message: "Some booking cart items were not found.", missingIds },
            { status: 404 }
          );
        }

        // 5. Ensure no items are already booked
        const alreadyBooked = items.filter(
          (item: { booking_id: string | null }) => item.booking_id
        );
        if (alreadyBooked.length > 0) {
          return NextResponse.json(
            {
              message: "One or more items are already linked to a booking.",
              bookedItemIds: alreadyBooked.map((i: { id: string }) => i.id),
            },
            { status: 400 }
          );
        }

        // 6. Ensure all items belong to the authenticated user
        const unauthorizedItems = items.filter(
          (item: { cart?: { user_id: string } | null }) =>
            item.cart?.user_id !== session?.userId
        );
        if (unauthorizedItems.length > 0) {
          return NextResponse.json(
            { message: "Access denied to one or more cart items." },
            { status: 403 }
          );
        }
      }

      // 7. Calculate total amount (sum of numeric prices)
      const numericPrices = items
        .map((item: { price: string | null }) => parseFloat(item.price ?? ""))
        .filter((p: number) => Number.isFinite(p));

      totalAmount =
        numericPrices.length > 0
          ? numericPrices.reduce((sum: number, p: number) => sum + p, 0).toFixed(2)
          : "0.00";

      paymentOrderData.booking_cart_items = bookingCartItemIds;
      paymentOrderData.amount = totalAmount;
    }

    // 8. Get user details for CCAvenue billing fields
    let userDetails = {
      email: "guest@fixnex.ae",
      fullName: "Guest Customer",
      phoneNumber: "0000000000",
    };

    if (body.guestDetails) {
      userDetails = {
        email: body.guestDetails.email,
        fullName: body.guestDetails.name,
        phoneNumber: body.guestDetails.phone,
      };
    } else if (session?.userId) {
      const user = await prisma.user.findUnique({
        where: { id: session.userId },
        select: { email: true, fullName: true, phoneNumber: true },
      });
      if (user) {
        userDetails = {
          email: user.email,
          fullName: user.fullName || "Customer",
          phoneNumber: user.phoneNumber || "0000000000",
        };
      }
    } else if (body.custom_link_id) {
      const customLink = await prisma.customPaymentLink.findUnique({
        where: { id: body.custom_link_id }
      });
      if (customLink && customLink.customer_email) {
        userDetails.email = customLink.customer_email;
      }
    }

    // 9. Create or Reuse PaymentOrder (temp record, status = PENDING)
    let paymentOrder;
    if (body.custom_link_id) {
      // Find existing or create new
      const existingOrder = await prisma.paymentOrder.findUnique({
        where: { custom_payment_link_id: body.custom_link_id },
      });
      if (existingOrder) {
        paymentOrder = await prisma.paymentOrder.update({
          where: { id: existingOrder.id },
          data: { status: "PENDING", updated_at: new Date() },
        });
      } else {
        paymentOrder = await prisma.paymentOrder.create({
          data: paymentOrderData,
        });
      }
    } else {
      paymentOrder = await prisma.paymentOrder.create({
        data: paymentOrderData,
      });
    }

    // 10. Build CCAvenue request params and encrypt
    const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

    const params: Record<string, string> = {
      merchant_id: merchantId,
      order_id: paymentOrder.id,
      currency: "AED",
      amount: totalAmount,
      redirect_url: `${appUrl}/api/payment/callback`,
      cancel_url: `${appUrl}/api/payment/callback`,
      language: "EN",
      // Billing details (Using realistic fallbacks to bypass strict AVS checks)
      billing_name: userDetails.fullName || "Customer",
      billing_email: userDetails.email,
      billing_tel: userDetails.phoneNumber || "0000000000",
      billing_address: "Dubai, United Arab Emirates",
      billing_city: "Dubai",
      billing_state: "Dubai",
      billing_zip: "",
      billing_country: "UAE",
      // Delivery (same as billing for services)
      delivery_name: userDetails.fullName || "Customer",
      delivery_address: "Dubai, United Arab Emirates",
      delivery_city: "Dubai",
      delivery_state: "Dubai",
      delivery_zip: "",
      delivery_country: "UAE",
      // Merchant param1 carries our PaymentOrder id through to the callback
      merchant_param1: paymentOrder.id,
    };

    const plainText = buildRequestParams(params);
    const encRequest = encrypt(plainText);
    const actionUrl = getCCAvenueUrl();

    // 11. Return what the client needs to build and submit the CCAvenue redirect form
    return NextResponse.json({ encRequest, accessCode, actionUrl }, { status: 200 });
  } catch (error) {
    console.error("Payment initiation error:", error);
    return NextResponse.json(
      { message: `Failed to initiate payment. ${(error as Error).message}` },
      { status: 500 }
    );
  }
}
