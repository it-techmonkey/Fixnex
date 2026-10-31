// Server-side plan logic: who is a member, what they pay, and how many visits are left.
import type { Prisma, Subscription } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import {
  PLAN_RULES,
  PREVENTIVE_CHECK_INTERVAL_DAYS,
  RENEW_WINDOW_DAYS,
  addDays,
  formatPlanDate,
  isPriorityService,
  isServiceIncluded,
  listedMonthlyPrice,
  parsePrice,
  toMoney,
  type Coverage,
  type PlanTierName,
  type PropertyTypeId,
} from "@/lib/plans";

export type Db = Prisma.TransactionClient | typeof prisma;
export type PropertyScope = "PLAN" | "OTHER";

/** A started-but-unpaid checkout holds its included visits for this long. */
const RESERVATION_MINUTES = 120;
const INACTIVE_BOOKING_STATUSES = ["CANCELLED", "REJECTED"] as const;

/**
 * Serialises plan changes and plan bookings for one customer (released when the transaction
 * ends). Stops two tabs from using the same last visit, or two payments overlapping months.
 */
export async function lockCustomerPlans(tx: Prisma.TransactionClient, userId: string) {
  const key = `plan:${userId}`;
  await tx.$queryRaw`SELECT 1 AS locked FROM (SELECT pg_advisory_xact_lock(hashtext(${key}))) AS l`;
}

/** Paid months that have not ended yet (current and upcoming), oldest first. */
export function getLivePeriods(db: Db, userId: string, now = new Date()) {
  return db.subscription.findMany({
    where: { user_id: userId, status: "ACTIVE", ends_at: { gt: now } },
    orderBy: { starts_at: "asc" },
  });
}

export const periodAt = (periods: Subscription[], at: Date) =>
  periods.find((p) => p.starts_at <= at && at < p.ends_at) ?? null;

export const visitsAllowed = (period: Subscription) =>
  period.visits_included === null ? null : period.visits_included + period.visits_bonus;

/**
 * Included visits already used per plan month: booked (and not cancelled) plus those held by
 * checkouts still waiting for payment. Checkouts for `ignoreItemIds` are skipped, so a customer
 * retrying the same cart does not block their own visit.
 */
export async function countUsedVisits(
  db: Db,
  userId: string,
  subscriptionIds: string[],
  ignoreItemIds: string[] = [],
  now = new Date()
): Promise<Map<string, number>> {
  const used = new Map<string, number>(subscriptionIds.map((id) => [id, 0]));
  if (subscriptionIds.length === 0) return used;

  const booked = await db.bookingCartItem.findMany({
    where: {
      subscription_id: { in: subscriptionIds },
      coverage: "INCLUDED",
      booking: { status: { notIn: [...INACTIVE_BOOKING_STATUSES] } },
    },
    select: { subscription_id: true },
  });
  for (const item of booked) {
    if (item.subscription_id) used.set(item.subscription_id, (used.get(item.subscription_id) ?? 0) + 1);
  }

  const pending = await db.paymentOrder.findMany({
    where: {
      user_id: userId,
      purpose: "BOOKING",
      status: "PENDING",
      included_visits: { gt: 0 },
      created_at: { gt: new Date(now.getTime() - RESERVATION_MINUTES * 60 * 1000) },
    },
    select: { pricing: true, booking_cart_items: true },
  });
  const ignore = new Set(ignoreItemIds);
  for (const order of pending) {
    if (order.booking_cart_items.some((id) => ignore.has(id))) continue;
    for (const item of readPricing(order.pricing)) {
      if (item.coverage === "INCLUDED" && item.subscriptionId && used.has(item.subscriptionId)) {
        used.set(item.subscriptionId, (used.get(item.subscriptionId) ?? 0) + 1);
      }
    }
  }
  return used;
}

// ---------------------------------------------------------------------------
// Booking prices
// ---------------------------------------------------------------------------

export type PricingInputItem = {
  id: string;
  scheduled_date: Date | null;
  price?: string | null;
  services: { name: string; normal_price: string; member_price: string } | null;
};

export type QuotedItem = {
  itemId: string;
  serviceName: string;
  coverage: Coverage;
  /** What the customer pays for this item, AED. */
  price: number;
  /** Set when the listed price is text (e.g. "Custom Quote"). */
  priceText: string | null;
  normalPrice: number | null;
  memberPrice: number | null;
  subscriptionId: string | null;
  priority: boolean;
  note: string | null;
};

export type MemberSnapshot = {
  subscriptionId: string;
  code: string;
  plan: PlanTierName;
  propertyType: string;
  propertyArea: string;
  endsAt: Date;
  coverageEndsAt: Date;
  visitsAllowed: number | null;
  visitsUsed: number;
};

export type BookingQuote = {
  items: QuotedItem[];
  total: number;
  /** How many INCLUDED items this booking uses. */
  includedVisits: number;
  priority: boolean;
  propertyScope: PropertyScope | null;
  member: MemberSnapshot | null;
};

/** Pricing stored on a PaymentOrder at checkout and honoured when the payment completes. */
export type StoredPricing = {
  items: Array<Pick<QuotedItem, "itemId" | "coverage" | "price" | "subscriptionId" | "priority">>;
  total: number;
  propertyScope: PropertyScope | null;
  memberPlan: PlanTierName | null;
  memberSubscriptionId: string | null;
};

export function readPricing(value: Prisma.JsonValue | null | undefined): StoredPricing["items"] {
  const items = (value as StoredPricing | null)?.items;
  return Array.isArray(items) ? items : [];
}

export const toStoredPricing = (quote: BookingQuote): StoredPricing => ({
  items: quote.items.map(({ itemId, coverage, price, subscriptionId, priority }) => ({
    itemId,
    coverage,
    price,
    subscriptionId,
    priority,
  })),
  total: quote.total,
  propertyScope: quote.propertyScope,
  memberPlan: quote.member?.plan ?? null,
  memberSubscriptionId: quote.member?.subscriptionId ?? null,
});

/**
 * Works out what each cart item costs for this customer. The server always uses this; prices
 * sent by the browser are never trusted.
 *  - Not a member: normal price.
 *  - Member, service included in the plan, on the plan property, visits left: AED 0.
 *  - Any other case for a member: member price.
 */
export async function quoteBooking(
  db: Db,
  options: {
    userId: string | null;
    items: PricingInputItem[];
    propertyScope?: PropertyScope | null;
    now?: Date;
  }
): Promise<BookingQuote> {
  const now = options.now ?? new Date();
  const periods = options.userId ? await getLivePeriods(db, options.userId, now) : [];
  const current = periodAt(periods, now);
  const scope: PropertyScope = options.propertyScope === "OTHER" ? "OTHER" : "PLAN";

  const used = current
    ? await countUsedVisits(db, options.userId!, periods.map((p) => p.id), options.items.map((i) => i.id), now)
    : new Map<string, number>();
  const coverageEndsAt = periods.length ? periods[periods.length - 1].ends_at : null;

  // Earliest visits first, so included visits go to the soonest bookings.
  const ordered = [...options.items].sort(
    (a, b) => (a.scheduled_date?.getTime() ?? 0) - (b.scheduled_date?.getTime() ?? 0)
  );

  const quoted = new Map<string, QuotedItem>();
  for (const item of ordered) {
    const serviceName = item.services?.name ?? "Service";
    const normalText = item.services?.normal_price ?? item.price ?? "";
    const normalPrice = parsePrice(normalText);
    const memberPrice = parsePrice(item.services?.member_price) ?? normalPrice;
    const base: QuotedItem = {
      itemId: item.id,
      serviceName,
      coverage: "NORMAL",
      price: normalPrice ?? 0,
      priceText: normalPrice === null ? normalText || null : null,
      normalPrice,
      memberPrice,
      subscriptionId: null,
      priority: false,
      note: null,
    };

    if (!current) {
      quoted.set(item.id, base);
      continue;
    }

    const memberItem: QuotedItem = {
      ...base,
      coverage: "MEMBER",
      price: memberPrice ?? 0,
      priceText: memberPrice === null ? normalText || null : null,
      priority: isPriorityService(current.plan as PlanTierName, serviceName),
    };

    const visitDate = item.scheduled_date && item.scheduled_date > now ? item.scheduled_date : now;
    const period = periodAt(periods, visitDate);
    const plan = (period?.plan ?? current.plan) as PlanTierName;

    if (!isServiceIncluded(plan, serviceName)) {
      quoted.set(item.id, memberItem);
      continue;
    }
    if (scope === "OTHER") {
      quoted.set(item.id, { ...memberItem, note: "Member price (not your plan property)" });
      continue;
    }
    if (!period) {
      quoted.set(item.id, {
        ...memberItem,
        note: `Your plan ends on ${formatPlanDate(coverageEndsAt)}. Renew to include this visit.`,
      });
      continue;
    }

    const allowed = visitsAllowed(period);
    const usedSoFar = used.get(period.id) ?? 0;
    if (allowed !== null && usedSoFar >= allowed) {
      quoted.set(item.id, { ...memberItem, note: "No included visits left for that month" });
      continue;
    }
    used.set(period.id, usedSoFar + 1);
    quoted.set(item.id, {
      ...memberItem,
      coverage: "INCLUDED",
      price: 0,
      priceText: null,
      subscriptionId: period.id,
      priority: isPriorityService(plan, serviceName),
    });
  }

  // Keep the cart's own order for display.
  const items = options.items.map((i) => quoted.get(i.id)!);
  const total = toMoney(items.reduce((sum, i) => sum + i.price, 0));

  let member: MemberSnapshot | null = null;
  if (current) {
    const visitsUsed = (await countUsedVisits(db, options.userId!, [current.id], [], now)).get(current.id) ?? 0;
    member = {
      subscriptionId: current.id,
      code: current.code,
      plan: current.plan as PlanTierName,
      propertyType: current.property_type,
      propertyArea: current.property_area,
      endsAt: current.ends_at,
      coverageEndsAt: coverageEndsAt!,
      visitsAllowed: visitsAllowed(current),
      visitsUsed,
    };
  }

  return {
    items,
    total,
    includedVisits: items.filter((i) => i.coverage === "INCLUDED").length,
    priority: items.some((i) => i.priority),
    propertyScope: current ? scope : null,
    member,
  };
}

// ---------------------------------------------------------------------------
// Renewals, upgrades and preventive checks
// ---------------------------------------------------------------------------

export type RenewalStatus = {
  allowed: boolean;
  /** When paying for next month becomes possible (null = now / no plan yet). */
  opensAt: Date | null;
  /** When the paid month would start. */
  startsAt: Date;
  reason: string | null;
};

export function renewalStatus(periods: Subscription[], now = new Date()): RenewalStatus {
  if (periods.length === 0) return { allowed: true, opensAt: null, startsAt: now, reason: null };
  const upcoming = periods.find((p) => p.starts_at > now);
  const last = periods[periods.length - 1];
  if (upcoming) {
    return {
      allowed: false,
      opensAt: addDays(last.ends_at, -RENEW_WINDOW_DAYS),
      startsAt: last.ends_at,
      reason: `Your next month is already paid (from ${formatPlanDate(upcoming.starts_at)}).`,
    };
  }
  const opensAt = addDays(last.ends_at, -RENEW_WINDOW_DAYS);
  if (now < opensAt) {
    return {
      allowed: false,
      opensAt,
      startsAt: last.ends_at,
      reason: `You can pay for next month from ${formatPlanDate(opensAt)}.`,
    };
  }
  return { allowed: true, opensAt, startsAt: last.ends_at, reason: null };
}

export type UpgradeQuote =
  | { ok: true; amount: number; targets: Array<{ id: string; newPrice: number }> }
  | { ok: false; reason: string };

/**
 * FixLite -> FixPro. The customer pays the price difference for the days left this month (and the
 * full difference for a next month already paid on FixLite). The end date stays the same.
 */
export function upgradeQuote(periods: Subscription[], now = new Date()): UpgradeQuote {
  const current = periodAt(periods, now);
  if (!current) return { ok: false, reason: "You don't have an active plan." };
  if (current.plan !== "FIXLITE") return { ok: false, reason: "Upgrades are available from FixLite to FixPro." };

  let amount = 0;
  const targets: Array<{ id: string; newPrice: number }> = [];
  for (const period of periods) {
    if (period.plan !== "FIXLITE") continue;
    const newPrice = listedMonthlyPrice("FIXPRO", period.property_type as PropertyTypeId);
    if (newPrice === null) return { ok: false, reason: "FixPro is not available for this property type." };
    const oldPrice = parsePrice(period.price) ?? 0;
    const length = period.ends_at.getTime() - period.starts_at.getTime();
    const fraction =
      period.id === current.id && length > 0 ? (period.ends_at.getTime() - now.getTime()) / length : 1;
    amount += Math.max(0, newPrice - oldPrice) * Math.min(1, Math.max(0, fraction));
    targets.push({ id: period.id, newPrice });
  }
  // Round up to the fils; the gateway needs at least AED 1.
  return { ok: true, amount: Math.max(1, Math.ceil(amount * 100) / 100), targets };
}

export type PreventiveCheckStatus = {
  available: boolean;
  eligible: boolean;
  nextAvailableAt: Date | null;
  reason: string | null;
};

export async function preventiveCheckStatus(
  db: Db,
  userId: string,
  current: Subscription | null,
  now = new Date()
): Promise<PreventiveCheckStatus> {
  if (!current || !PLAN_RULES[current.plan as PlanTierName].preventiveCheck) {
    return { available: false, eligible: false, nextAvailableAt: null, reason: null };
  }
  const last = await db.booking.findFirst({
    where: {
      user_id: userId,
      is_preventive_check: true,
      status: { notIn: [...INACTIVE_BOOKING_STATUSES] },
      created_at: { gt: addDays(now, -PREVENTIVE_CHECK_INTERVAL_DAYS) },
    },
    orderBy: { created_at: "desc" },
    select: { created_at: true },
  });
  if (last) {
    const nextAvailableAt = addDays(last.created_at, PREVENTIVE_CHECK_INTERVAL_DAYS);
    return {
      available: true,
      eligible: false,
      nextAvailableAt,
      reason: `Your next preventive check can be booked from ${formatPlanDate(nextAvailableAt)}.`,
    };
  }
  return { available: true, eligible: true, nextAvailableAt: null, reason: null };
}

/** Plan request saved on a PaymentOrder / payment link and applied once paid. */
export type PlanRequest = {
  kind: "buy" | "upgrade";
  userId: string;
  plan: PlanTierName;
  propertyType: string;
  propertyArea: string;
  /** Monthly price for the month being bought (buy), AED. */
  price: number;
  /** upgrade only: plan months to switch to FixPro and their new monthly price. */
  targets?: Array<{ id: string; newPrice: number }>;
};

export function readPlanRequest(value: Prisma.JsonValue | null | undefined): PlanRequest | null {
  const req = value as PlanRequest | null;
  if (!req || typeof req !== "object" || !req.userId || !req.plan) return null;
  return req;
}
