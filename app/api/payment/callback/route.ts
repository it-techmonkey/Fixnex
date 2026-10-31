import { NextRequest, NextResponse } from "next/server";
import { Prisma, type Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { generateBookingCode, generatePaymentLinkCode } from "@/lib/readableIds";
import { decrypt, parseCCResponse } from "@/lib/ccavenue";
import { readPlanRequest, readPricing, type PlanRequest, type StoredPricing } from "@/lib/membership";
import { activatePlanMonth, applyUpgrade } from "@/lib/planActivation";
import { PLAN_NAMES, formatPlanDate, parsePrice, propertyLabel, type PlanTierName } from "@/lib/plans";
import { notifyTeam, sendPlanReceipt } from "@/lib/planEmails";

type SuccessResult = {
  code: string;
  kind: "booking" | "payment_link" | "plan" | "upgrade";
  subscription?: Subscription | null;
  upgradedCount?: number;
  planRequest?: PlanRequest | null;
};

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

    // 4. Find the PaymentOrder (using raw query to bypass aggressive Next.js dev cache)
    const paymentOrders: any[] = await prisma.$queryRaw`SELECT * FROM payment_orders WHERE id = ${orderId}`;
    const paymentOrder = paymentOrders[0];

    if (!paymentOrder) {
      console.error("PaymentOrder not found:", orderId);
      return NextResponse.redirect(`${appUrl}/payment/failure?reason=order_not_found`, {
        status: 302,
      });
    }

    const isPlanOrder = paymentOrder.purpose === "PLAN";

    // 5. Idempotency guard — do not process the same order twice
    if (paymentOrder.status !== "PENDING") {
      console.warn(`PaymentOrder ${orderId} already processed. Status: ${paymentOrder.status}`);
      if (paymentOrder.status === "SUCCESS") {
        const reference = encodeURIComponent(paymentOrder.order_code ?? orderId);
        const type = isPlanOrder ? "&type=plan" : "";
        return NextResponse.redirect(`${appUrl}/payment/success?orderId=${reference}${type}`, {
          status: 302,
        });
      }
      return NextResponse.redirect(`${appUrl}/payment/failure?orderId=${orderId}`, {
        status: 302,
      });
    }

    const isSuccess = orderStatus === "Success";

    if (isSuccess) {
      // 6a. Success path — everything is created in one transaction.
      const paymentData = {
        order_id: paymentOrder.id,
        transaction_id: bankRefNo,
        tracking_id: trackingId,
        amount: paymentOrder.amount,
        status: orderStatus,
        gateway: "ccavenue",
        raw_response: ccData as object,
      };

      const result = await prisma.$transaction(
        async (tx: Prisma.TransactionClient): Promise<SuccessResult> => {
          let outcome: SuccessResult;

          if (isPlanOrder) {
            // --- PLAN PURCHASE / RENEWAL / UPGRADE ---
            const planRequest = readPlanRequest(paymentOrder.plan_request);
            if (!planRequest) {
              // Should not happen; keep the money traceable and tell the team.
              outcome = { code: await generatePaymentLinkCode(tx), kind: "plan", planRequest: null };
            } else if (planRequest.kind === "upgrade") {
              const { code, upgraded } = await applyUpgrade(tx, planRequest);
              outcome = { code, kind: "upgrade", upgradedCount: upgraded.length, planRequest, subscription: upgraded[0] ?? null };
            } else {
              const subscription = await activatePlanMonth(tx, {
                userId: planRequest.userId,
                plan: planRequest.plan,
                propertyType: planRequest.propertyType,
                propertyArea: planRequest.propertyArea,
                price: planRequest.price,
                source: "online",
                paymentOrderId: paymentOrder.id,
              });
              outcome = { code: subscription.code, kind: "plan", subscription, planRequest };
            }
            await tx.payment.create({ data: paymentData });
          } else if (paymentOrder.custom_payment_link_id) {
            // --- CUSTOM PAYMENT LINK FLOW ---
            const link = await tx.customPaymentLink.update({
              where: { id: paymentOrder.custom_payment_link_id },
              data: { status: "SUCCESS" },
            });

            // A link created from the Subscriptions page pays for a plan month (e.g. FixMax).
            const planRequest = readPlanRequest(link.plan_request);
            if (planRequest) {
              const subscription = await activatePlanMonth(tx, {
                userId: planRequest.userId,
                plan: planRequest.plan,
                propertyType: planRequest.propertyType,
                propertyArea: planRequest.propertyArea,
                price: parsePrice(link.amount) ?? planRequest.price,
                source: "payment_link",
                paymentOrderId: paymentOrder.id,
              });
              outcome = { code: subscription.code, kind: "plan", subscription, planRequest };
            } else {
              outcome = { code: await generatePaymentLinkCode(tx), kind: "payment_link" };
            }

            // Create payment record (so it appears in ledger)
            await tx.payment.create({ data: paymentData });
          } else {
            // --- STANDARD CHECKOUT FLOW ---
            const items = await tx.bookingCartItem.findMany({
              where: { id: { in: paymentOrder.booking_cart_items } },
              include: { services: { select: { name: true } } },
            });

            // Prices quoted at checkout (member / included / normal) are honoured as paid.
            const stored = paymentOrder.pricing as StoredPricing | null;
            const priced = new Map(readPricing(stored).map((p) => [p.itemId, p]));
            for (const item of items) {
              const p = priced.get(item.id);
              if (!p) continue;
              await tx.bookingCartItem.update({
                where: { id: item.id },
                data: {
                  price: p.price.toFixed(2),
                  coverage: p.coverage,
                  subscription_id: p.coverage === "INCLUDED" ? p.subscriptionId : null,
                },
              });
            }

            // Orders started before plans existed have no stored pricing: sum the item prices.
            const numericPrices = items
              .map((item: { price: string | null }) => parseFloat(item.price ?? ""))
              .filter((p: number) => Number.isFinite(p));
            const totalPrice = stored
              ? Number(stored.total).toFixed(2)
              : numericPrices.length > 0
                ? numericPrices.reduce((sum: number, p: number) => sum + p, 0).toFixed(2)
                : paymentOrder.amount;

            const firstItem = items[0];
            const code = await generateBookingCode(
              tx,
              items.map((item: { services: { name: string } | null }) => item.services?.name)
            );

            // Create the booking (same ID as the order)
            const booking = await tx.booking.create({
              data: {
                booking_code: code,
                user_id: paymentOrder.user_id,
                guest_name: !paymentOrder.user_id ? (ccData["billing_name"] || "Guest") : null,
                guest_email: !paymentOrder.user_id ? ccData["billing_email"] : null,
                guest_phone: !paymentOrder.user_id ? ccData["billing_tel"] : null,
                category_name: firstItem?.category_name ?? null,
                location: firstItem?.location ?? null,
                service_type: firstItem?.service_type ?? null,
                scheduled_date: firstItem?.scheduled_date ?? null,
                time_slot: firstItem?.time_slot ?? null,
                price: totalPrice,
                status: "PENDING",
                payment_status: "PAID",
                member_plan: stored?.memberPlan ?? null,
                subscription_id: stored?.memberSubscriptionId ?? null,
                property_scope: stored?.propertyScope ?? null,
                is_priority: readPricing(stored).some((p) => p.priority),
              },
            });

            // Link all cart items to the new booking
            await tx.bookingCartItem.updateMany({
              where: { id: { in: paymentOrder.booking_cart_items } },
              data: { booking_id: booking.id },
            });

            // Create payment record linked to booking
            await tx.payment.create({ data: { ...paymentData, booking_id: booking.id } });
            outcome = { code, kind: "booking" };
          }

          // Mark payment order as succeeded
          await tx.paymentOrder.update({
            where: { id: paymentOrder.id },
            data: { status: "SUCCESS", order_code: outcome.code },
          });

          return outcome;
        },
        { timeout: 20000 }
      );
      const orderCode = result.code;

      // Clear cart (best-effort, outside transaction — failure here does not block the user)
      if (result.kind === "booking" && paymentOrder.user_id) {
        try {
          await prisma.cart.update({
            where: { user_id: paymentOrder.user_id },
            data: { services: { set: [] } },
          });
        } catch (cartErr) {
          console.error("Failed to clear cart after successful payment:", cartErr);
        }
      }

      if (result.kind === "plan" || result.kind === "upgrade") {
        await sendPlanEmails(result, paymentOrder.amount, bankRefNo || trackingId || "N/A");
      } else {
        await sendInvoice(paymentOrder, ccData, orderCode, orderStatus, bankRefNo || trackingId || "N/A");
      }

      const type = result.kind === "plan" || result.kind === "upgrade" ? `&type=${result.kind}` : "";
      return NextResponse.redirect(
        `${appUrl}/payment/success?orderId=${encodeURIComponent(orderCode)}${type}`,
        { status: 302 }
      );
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

      const type = isPlanOrder ? "&type=plan" : "";
      return NextResponse.redirect(`${appUrl}/payment/failure?orderId=${orderId}${type}`, {
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

/** Booking / payment link invoice (unchanged behaviour). Never throws. */
async function sendInvoice(
  paymentOrder: any,
  ccData: Record<string, string>,
  orderCode: string,
  orderStatus: string,
  transactionId: string
) {
  try {
    const billingEmail = ccData["billing_email"];
    const billingName = ccData["billing_name"] || "Valued Customer";
    if (!billingEmail) return;

    const customer = paymentOrder.user_id
      ? await prisma.user.findUnique({
          where: { id: paymentOrder.user_id },
          select: { customer_code: true },
        })
      : null;
    const customerCode = customer?.customer_code ?? paymentOrder.user_id;
    const { resend } = await import("@/lib/resend");
    const { InvoiceEmail } = await import("@/app/components/emails/InvoiceEmail");
    const { render } = await import("@react-email/components");

    const htmlOutput = await render(
      InvoiceEmail({
        customerName: billingName,
        customerEmail: billingEmail,
        customerId: customerCode || "Guest",
        orderId: orderCode,
        transactionId,
        amount: paymentOrder.amount,
        date: new Date().toLocaleDateString(),
        time: new Date().toLocaleTimeString(),
        serviceName: paymentOrder.custom_payment_link_id ? "Custom Payment Link" : "Service Booking",
        status: orderStatus || "SUCCESS",
      })
    );

    await resend.emails.send({
      from: "payment@fixnex.ae",
      to: billingEmail,
      subject: `Payment Receipt - ${orderCode}`,
      html: htmlOutput,
    });
    console.log(`Invoice sent to ${billingEmail}`);
  } catch (emailErr) {
    console.error("Failed to send invoice email:", emailErr);
  }
}

/** Receipt to the customer and a notice to the team for plan payments. Never throws. */
async function sendPlanEmails(result: SuccessResult, amount: string, transactionId: string) {
  try {
    const req = result.planRequest;
    const user = req
      ? await prisma.user.findUnique({
          where: { id: req.userId },
          select: { email: true, fullName: true, customer_code: true, phoneNumber: true },
        })
      : null;

    const sub = result.subscription;
    const planName = sub ? PLAN_NAMES[sub.plan as PlanTierName] : req ? PLAN_NAMES[req.plan] : "Plan";
    const description =
      result.kind === "upgrade"
        ? `Upgrade to FixPro (until ${formatPlanDate(sub?.ends_at)})`
        : sub
          ? `${planName} plan · ${propertyLabel(sub.property_type)} · ${formatPlanDate(sub.starts_at)} – ${formatPlanDate(sub.ends_at)}`
          : `${planName} plan`;

    if (user?.email) {
      await sendPlanReceipt({
        to: user.email,
        customerName: user.fullName || "Valued Customer",
        customerId: user.customer_code || "-",
        orderCode: result.code,
        description,
        amount,
        transactionId,
      });
    }

    const needsAttention = !req || (result.kind === "upgrade" && !result.upgradedCount);
    await notifyTeam(
      needsAttention
        ? `ACTION NEEDED: plan payment ${result.code} could not be applied`
        : `New ${result.kind === "upgrade" ? "plan upgrade" : `${planName} plan payment`} - ${user?.fullName ?? "customer"}`,
      needsAttention
        ? "A plan payment was received but nothing was changed (e.g. paid twice). Please check it and refund if needed."
        : `${description}`,
      [
        ["Order ID", result.code],
        ["Customer", `${user?.fullName ?? "-"} (${user?.customer_code ?? "-"})`],
        ["Email", user?.email ?? "-"],
        ["Phone", user?.phoneNumber ?? "-"],
        ["Property", sub ? `${propertyLabel(sub.property_type)} · ${sub.property_area}` : "-"],
        ["Amount", `AED ${amount}`],
      ]
    );
  } catch (err) {
    console.error("Failed to send plan emails:", err);
  }
}
