import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { decrypt, parseCCResponse } from "@/lib/ccavenue";

/**
 * POST /api/payment/callback
 *
 * CCAvenue redirects the user's browser here (as a POST) after payment.
 * The encrypted response is in the `encResp` form field.
 *
 * No session/JWT check — CCAvenue posts to this URL from the user's browser
 * after the payment page, so the cookie may or may not be present.
 * Security is provided by AES decryption of the CCAvenue payload.
 */
export async function POST(request: NextRequest) {
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

  try {
    // 1. Extract encrypted response from form body
    const formData = await request.formData();
    const encResp = formData.get("encResp");

    if (!encResp || typeof encResp !== "string") {
      return NextResponse.redirect(`${appUrl}/payment/failure?reason=missing_response`, {
        status: 302,
      });
    }

    // 2. Decrypt and parse
    let ccData: Record<string, string>;
    try {
      const decrypted = decrypt(encResp);
      ccData = parseCCResponse(decrypted);
    } catch (err) {
      console.error("CCAvenue decryption failed:", err);
      return NextResponse.redirect(`${appUrl}/payment/failure?reason=invalid_response`, {
        status: 302,
      });
    }

    // 3. Extract key fields
    // merchant_param1 carries our PaymentOrder.id (set during initiation)
    const orderId = ccData["merchant_param1"] || ccData["order_id"];
    const orderStatus = ccData["order_status"];
    const trackingId = ccData["tracking_id"] || null;
    const bankRefNo = ccData["bank_ref_no"] || null;

    if (!orderId) {
      console.error("CCAvenue callback missing order reference. ccData:", ccData);
      return NextResponse.redirect(`${appUrl}/payment/failure?reason=missing_order`, {
        status: 302,
      });
    }

    // 4. Find the PaymentOrder
    const paymentOrder = await prisma.paymentOrder.findUnique({
      where: { id: orderId },
    });

    if (!paymentOrder) {
      console.error("PaymentOrder not found:", orderId);
      return NextResponse.redirect(`${appUrl}/payment/failure?reason=order_not_found`, {
        status: 302,
      });
    }

    // 5. Idempotency guard — do not process the same order twice
    if (paymentOrder.status !== "PENDING") {
      console.warn(`PaymentOrder ${orderId} already processed. Status: ${paymentOrder.status}`);
      if (paymentOrder.status === "SUCCESS") {
        return NextResponse.redirect(`${appUrl}/payment/success?orderId=${orderId}`, {
          status: 302,
        });
      }
      return NextResponse.redirect(`${appUrl}/payment/failure?orderId=${orderId}`, {
        status: 302,
      });
    }

    const isSuccess = orderStatus === "Success";

    if (isSuccess) {
      // 6a. Success path — create booking and payment record atomically
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Fetch the cart items to derive booking fields
        const items = await tx.bookingCartItem.findMany({
          where: { id: { in: paymentOrder.booking_cart_items } },
        });

        // Aggregate price (sum of item prices)
        const numericPrices = items
          .map((item: { price: string | null }) => parseFloat(item.price ?? ""))
          .filter((p: number) => Number.isFinite(p));

        const totalPrice =
          numericPrices.length > 0
            ? numericPrices.reduce((sum: number, p: number) => sum + p, 0).toFixed(2)
            : paymentOrder.amount;

        // Use first item's details as booking-level fields (same logic as bookings.controller.ts)
        const firstItem = items[0];

        // Create the booking
        const booking = await tx.booking.create({
          data: {
            user_id: paymentOrder.user_id,
            category_name: firstItem?.category_name ?? null,
            location: firstItem?.location ?? null,
            service_type: firstItem?.service_type ?? null,
            scheduled_date: firstItem?.scheduled_date ?? null,
            time_slot: firstItem?.time_slot ?? null,
            price: totalPrice,
            status: "PENDING",
          },
        });

        // Link all cart items to the new booking
        await tx.bookingCartItem.updateMany({
          where: { id: { in: paymentOrder.booking_cart_items } },
          data: { booking_id: booking.id },
        });

        // Create payment record
        await tx.payment.create({
          data: {
            order_id: paymentOrder.id,
            transaction_id: bankRefNo,
            tracking_id: trackingId,
            amount: paymentOrder.amount,
            status: orderStatus,
            gateway: "ccavenue",
            raw_response: ccData as object,
            booking_id: booking.id,
          },
        });

        // Mark payment order as succeeded
        await tx.paymentOrder.update({
          where: { id: paymentOrder.id },
          data: { status: "SUCCESS" },
        });
      });

      // Clear cart (best-effort, outside transaction — failure here does not block the user)
      try {
        await prisma.cart.update({
          where: { user_id: paymentOrder.user_id },
          data: { services: { set: [] } },
        });
      } catch (cartErr) {
        console.error("Failed to clear cart after successful payment:", cartErr);
      }

      return NextResponse.redirect(`${appUrl}/payment/success?orderId=${orderId}`, {
        status: 302,
      });
    } else {
      // 6b. Failure / Aborted / Invalid path — record payment, do NOT create booking
      await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        await tx.payment.create({
          data: {
            order_id: paymentOrder.id,
            transaction_id: bankRefNo,
            tracking_id: trackingId,
            amount: paymentOrder.amount,
            status: orderStatus ?? "Failure",
            gateway: "ccavenue",
            raw_response: ccData as object,
          },
        });

        await tx.paymentOrder.update({
          where: { id: paymentOrder.id },
          data: { status: "FAILED" },
        });
      });

      return NextResponse.redirect(`${appUrl}/payment/failure?orderId=${orderId}`, {
        status: 302,
      });
    }
  } catch (error) {
    console.error("Payment callback error:", error);
    return NextResponse.redirect(`${appUrl}/payment/failure?reason=server_error`, {
      status: 302,
    });
  }
}
