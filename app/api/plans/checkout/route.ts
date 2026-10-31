import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";
import {
  getLivePeriods,
  lockCustomerPlans,
  periodAt,
  renewalStatus,
  upgradeQuote,
  type PlanRequest,
} from "@/lib/membership";
import {
  PLAN_ID_TO_TIER,
  PLAN_NAMES,
  isPropertyType,
  listedMonthlyPrice,
  parsePrice,
  type PlanTierName,
  type PropertyTypeId,
} from "@/lib/plans";
import { GATEWAY_NOT_CONFIGURED_MESSAGE, buildGatewayCheckout, gatewayConfigured } from "@/lib/gatewayCheckout";

class CheckoutError extends Error {
  constructor(message: string, public status = 409) {
    super(message);
  }
}

const toTier = (value: unknown): PlanTierName | null => {
  const raw = String(value ?? "").trim();
  if (raw.toUpperCase() in PLAN_NAMES) return raw.toUpperCase() as PlanTierName;
  return PLAN_ID_TO_TIER[raw.toLowerCase() as keyof typeof PLAN_ID_TO_TIER] ?? null;
};

/**
 * Starts payment for a plan month ("buy": first month or next month) or a FixLite -> FixPro
 * upgrade. The price is always worked out here; nothing is activated until CCAvenue confirms.
 */
export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;
  const userId = auth.user.id;

  if (!gatewayConfigured()) {
    return NextResponse.json({ message: GATEWAY_NOT_CONFIGURED_MESSAGE }, { status: 503 });
  }

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  const action = body.action === "upgrade" ? "upgrade" : "buy";

  try {
    const order = await prisma.$transaction(async (tx) => {
      await lockCustomerPlans(tx, userId);
      const now = new Date();
      const periods = await getLivePeriods(tx, userId, now);
      let planRequest: PlanRequest;
      let amount: number;

      if (action === "upgrade") {
        const quote = upgradeQuote(periods, now);
        if (!quote.ok) throw new CheckoutError(quote.reason);
        const current = periodAt(periods, now)!;
        amount = quote.amount;
        planRequest = {
          kind: "upgrade",
          userId,
          plan: "FIXPRO",
          propertyType: current.property_type,
          propertyArea: current.property_area,
          price: quote.targets[0]?.newPrice ?? 0,
          targets: quote.targets,
        };
      } else {
        if (body.accept !== true) {
          throw new CheckoutError("Please confirm you understand the plan lasts one month and does not renew automatically.", 400);
        }
        const tier = toTier(body.plan);
        if (!tier) throw new CheckoutError("Please choose a plan.", 400);
        const area = typeof body.propertyArea === "string" ? body.propertyArea.trim().slice(0, 120) : "";
        if (!area) throw new CheckoutError("Please choose your property's area.", 400);

        const renewal = renewalStatus(periods, now);
        if (!renewal.allowed) throw new CheckoutError(renewal.reason ?? "You already have an active plan.");

        let propertyType: PropertyTypeId;
        let price: number | null;
        if (tier === "FIXMAX") {
          // FixMax has a custom price agreed with the team; only an existing FixMax member can renew it here.
          const latest = periods[periods.length - 1];
          if (latest?.plan !== "FIXMAX") {
            throw new CheckoutError("FixMax is priced for your property. Please request a quote and our team will set it up.", 400);
          }
          propertyType = latest.property_type as PropertyTypeId;
          price = parsePrice(latest.price);
        } else {
          if (!isPropertyType(body.propertyType)) throw new CheckoutError("Please choose your property type.", 400);
          propertyType = body.propertyType;
          price = listedMonthlyPrice(tier, propertyType);
        }
        if (!price) throw new CheckoutError("This plan is not available for that property type.", 400);

        amount = price;
        planRequest = { kind: "buy", userId, plan: tier, propertyType, propertyArea: area, price };
      }

      return tx.paymentOrder.create({
        data: {
          user_id: userId,
          booking_cart_items: [],
          amount: amount.toFixed(2),
          currency: "AED",
          purpose: "PLAN",
          plan_request: planRequest as unknown as Prisma.InputJsonValue,
        },
      });
    });

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, fullName: true, phoneNumber: true },
    });
    const checkout = buildGatewayCheckout(order.id, order.amount, {
      fullName: user?.fullName ?? "Customer",
      email: user?.email ?? auth.user.email,
      phone: user?.phoneNumber ?? "",
    });
    return NextResponse.json({ ...checkout, amount: order.amount });
  } catch (error) {
    if (error instanceof CheckoutError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }
    console.error("Plan checkout failed:", error);
    return NextResponse.json({ message: "We couldn't start the payment. Please try again." }, { status: 500 });
  }
}
