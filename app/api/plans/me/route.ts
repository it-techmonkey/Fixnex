import { NextRequest, NextResponse } from "next/server";
import type { Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";
import {
  countUsedVisits,
  getLivePeriods,
  periodAt,
  preventiveCheckStatus,
  renewalStatus,
  upgradeQuote,
  visitsAllowed,
} from "@/lib/membership";
import {
  PLAN_NAMES,
  PROPERTY_TYPES,
  listedMonthlyPrice,
  parsePrice,
  planBenefitSummary,
  propertyLabel,
  type PlanTierName,
  type PropertyTypeId,
} from "@/lib/plans";

export const dynamic = "force-dynamic";

const periodView = (p: Subscription, now: Date) => ({
  id: p.id,
  code: p.code,
  plan: p.plan,
  planName: PLAN_NAMES[p.plan as PlanTierName],
  propertyType: p.property_type,
  propertyLabel: propertyLabel(p.property_type),
  propertyArea: p.property_area,
  price: p.price,
  startsAt: p.starts_at,
  endsAt: p.ends_at,
  state:
    p.status === "CANCELLED" ? "CANCELLED" : p.starts_at > now ? "UPCOMING" : p.ends_at <= now ? "ENDED" : "ACTIVE",
});

/** Everything the My Plan page and the plans section need for the signed-in customer. */
export async function GET(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;
  const userId = auth.user.id;
  const now = new Date();

  try {
    const [periods, history, profile] = await Promise.all([
      getLivePeriods(prisma, userId, now),
      prisma.subscription.findMany({ where: { user_id: userId }, orderBy: { starts_at: "desc" }, take: 24 }),
      prisma.user.findUnique({
        where: { id: userId },
        select: { fullName: true, email: true, phoneNumber: true, countryCode: true, customer_code: true },
      }),
    ]);
    const current = periodAt(periods, now);
    const used = current ? (await countUsedVisits(prisma, userId, [current.id], [], now)).get(current.id) ?? 0 : 0;
    const renewal = renewalStatus(periods, now);
    const upgrade = current?.plan === "FIXLITE" ? upgradeQuote(periods, now) : null;
    const preventiveCheck = await preventiveCheckStatus(prisma, userId, current, now);

    // Prices for paying the next month. FixMax keeps the customer's agreed price.
    const latest = periods[periods.length - 1] ?? history[0] ?? null;
    const propertyType = (latest?.property_type ?? "apartment") as PropertyTypeId;
    const renewalPrices: Partial<Record<PlanTierName, number>> = {};
    for (const tier of ["FIXLITE", "FIXPRO"] as PlanTierName[]) {
      const price = listedMonthlyPrice(tier, propertyType);
      if (price !== null) renewalPrices[tier] = price;
    }
    if (latest?.plan === "FIXMAX" && latest.status === "ACTIVE") {
      const price = parsePrice(latest.price);
      if (price) renewalPrices.FIXMAX = price;
    }

    const upcoming = periods.filter((p) => p.starts_at > now);

    return NextResponse.json({
      profile,
      current: current
        ? {
            ...periodView(current, now),
            visitsAllowed: visitsAllowed(current),
            visitsUsed: used,
            benefits: planBenefitSummary(current.plan as PlanTierName),
          }
        : null,
      upcoming: upcoming.map((p) => periodView(p, now)),
      coverageEndsAt: periods.length ? periods[periods.length - 1].ends_at : null,
      latest: latest ? periodView(latest, now) : null,
      renewal: {
        allowed: renewal.allowed,
        opensAt: renewal.opensAt,
        startsAt: renewal.startsAt,
        reason: renewal.reason,
        prices: renewalPrices,
        propertyType,
      },
      upgrade: upgrade
        ? upgrade.ok
          ? { available: true, amount: upgrade.amount, reason: null }
          : { available: false, amount: null, reason: upgrade.reason }
        : null,
      preventiveCheck,
      history: history.map((p) => periodView(p, now)),
      propertyTypes: PROPERTY_TYPES,
    });
  } catch (error) {
    console.error("Failed to load plan:", error);
    return NextResponse.json({ message: "Failed to load your plan." }, { status: 500 });
  }
}
