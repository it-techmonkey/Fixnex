import { NextRequest, NextResponse } from "next/server";
import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { countUsedVisits, visitsAllowed, type PlanRequest } from "@/lib/membership";
import { activatePlanMonth } from "@/lib/planActivation";
import {
  PLAN_NAMES,
  addDays,
  isPropertyType,
  parsePrice,
  propertyLabel,
  toMoney,
  type PlanTierName,
} from "@/lib/plans";

export const dynamic = "force-dynamic";

const VIEWS = ["active", "ending", "upcoming", "ended", "cancelled", "all"] as const;
type View = (typeof VIEWS)[number];

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const params = request.nextUrl.searchParams;
    const view = (VIEWS as readonly string[]).includes(params.get("view") ?? "") ? (params.get("view") as View) : "active";
    const search = params.get("search")?.trim();
    const now = new Date();

    const where: Prisma.SubscriptionWhereInput = {};
    if (view === "active") Object.assign(where, { status: "ACTIVE", starts_at: { lte: now }, ends_at: { gt: now } });
    if (view === "ending") Object.assign(where, { status: "ACTIVE", starts_at: { lte: now }, ends_at: { gt: now, lte: addDays(now, 7) } });
    if (view === "upcoming") Object.assign(where, { status: "ACTIVE", starts_at: { gt: now } });
    if (view === "ended") Object.assign(where, { status: "ACTIVE", ends_at: { lte: now } });
    if (view === "cancelled") where.status = "CANCELLED";
    if (search) {
      where.OR = [
        { code: { contains: search, mode: "insensitive" } },
        { property_area: { contains: search, mode: "insensitive" } },
        { user: { is: { fullName: { contains: search, mode: "insensitive" } } } },
        { user: { is: { email: { contains: search, mode: "insensitive" } } } },
        { user: { is: { customer_code: { contains: search, mode: "insensitive" } } } },
      ];
    }

    const [rows, activeByPlan, endingSoon, recentRevenue] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy: view === "ended" ? { ends_at: "desc" } : view === "upcoming" ? { starts_at: "asc" } : { ends_at: "asc" },
        take: 300,
        include: {
          user: { select: { id: true, fullName: true, email: true, phoneNumber: true, customer_code: true } },
        },
      }),
      prisma.subscription.groupBy({
        by: ["plan"],
        where: { status: "ACTIVE", starts_at: { lte: now }, ends_at: { gt: now } },
        _count: { _all: true },
      }),
      prisma.subscription.count({
        where: { status: "ACTIVE", starts_at: { lte: now }, ends_at: { gt: now, lte: addDays(now, 7) } },
      }),
      prisma.subscription.findMany({
        where: { status: "ACTIVE", created_at: { gt: addDays(now, -30) } },
        select: { price: true },
      }),
    ]);

    // Has the customer already paid for a later month?
    const userIds = [...new Set(rows.map((r) => r.user_id))];
    const later = userIds.length
      ? await prisma.subscription.findMany({
          where: { user_id: { in: userIds }, status: "ACTIVE" },
          select: { user_id: true, starts_at: true },
        })
      : [];

    const used = new Map<string, number>();
    for (const userId of userIds) {
      const ids = rows.filter((r) => r.user_id === userId && r.visits_included !== null).map((r) => r.id);
      if (!ids.length) continue;
      for (const [id, n] of await countUsedVisits(prisma, userId, ids, [], now)) used.set(id, n);
    }

    const subscriptions = rows.map((r) => ({
      id: r.id,
      code: r.code,
      plan: r.plan,
      planName: PLAN_NAMES[r.plan as PlanTierName],
      propertyType: r.property_type,
      propertyLabel: propertyLabel(r.property_type),
      propertyArea: r.property_area,
      price: r.price,
      startsAt: r.starts_at,
      endsAt: r.ends_at,
      status: r.status,
      state:
        r.status === "CANCELLED" ? "CANCELLED" : r.starts_at > now ? "UPCOMING" : r.ends_at <= now ? "ENDED" : "ACTIVE",
      source: r.source,
      visitsAllowed: visitsAllowed(r),
      visitsUsed: used.get(r.id) ?? null,
      visitsBonus: r.visits_bonus,
      renewed: later.some((l) => l.user_id === r.user_id && l.starts_at >= r.ends_at),
      adminNote: r.admin_note,
      user: r.user,
    }));

    const counts = { FIXLITE: 0, FIXPRO: 0, FIXMAX: 0 } as Record<PlanTierName, number>;
    for (const g of activeByPlan) counts[g.plan as PlanTierName] = g._count._all;

    return NextResponse.json({
      subscriptions,
      stats: {
        active: counts,
        endingThisWeek: endingSoon,
        revenueLast30Days: toMoney(recentRevenue.reduce((s, r) => s + (parsePrice(r.price) ?? 0), 0)),
      },
    });
  } catch (error) {
    console.error("Failed to load subscriptions:", error);
    return NextResponse.json({ message: "Failed to load subscriptions." }, { status: 500 });
  }
}

/**
 * Creates a plan month for a customer (mainly FixMax after a quote).
 *  - mode "link": creates a payment link; the month starts when the customer pays.
 *  - mode "activate": starts it now, e.g. when the customer paid another way.
 */
export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ message: "Invalid request." }, { status: 400 });

  const email = String(body.email ?? "").trim().toLowerCase();
  const plan = String(body.plan ?? "").toUpperCase() as PlanTierName;
  const propertyType = body.propertyType;
  const propertyArea = String(body.propertyArea ?? "").trim().slice(0, 120);
  const price = parsePrice(body.price);
  const mode = body.mode === "activate" ? "activate" : "link";
  const note = String(body.note ?? "").trim().slice(0, 500) || null;

  if (!email) return NextResponse.json({ message: "Customer email is required." }, { status: 400 });
  if (!(plan in PLAN_NAMES)) return NextResponse.json({ message: "Choose a plan." }, { status: 400 });
  if (!isPropertyType(propertyType)) return NextResponse.json({ message: "Choose a property type." }, { status: 400 });
  if (!propertyArea) return NextResponse.json({ message: "Property area is required." }, { status: 400 });
  if (!price || price < 1) return NextResponse.json({ message: "Enter the monthly price (at least AED 1)." }, { status: 400 });

  const user = await prisma.user.findFirst({
    where: { email: { equals: email, mode: "insensitive" } },
    select: { id: true, email: true, fullName: true },
  });
  if (!user) {
    return NextResponse.json(
      { message: "No account uses this email. Ask the customer to sign up first (it takes a minute), then try again." },
      { status: 404 }
    );
  }

  try {
    if (mode === "activate") {
      const subscription = await prisma.$transaction((tx) =>
        activatePlanMonth(tx, {
          userId: user.id,
          plan,
          propertyType,
          propertyArea,
          price,
          source: "admin",
          note: note ?? `Activated by ${auth.user.email}`,
        })
      );
      return NextResponse.json({ subscription }, { status: 201 });
    }

    const planRequest: PlanRequest = { kind: "buy", userId: user.id, plan, propertyType, propertyArea, price };
    const link = await prisma.customPaymentLink.create({
      data: {
        amount: price.toFixed(2),
        description: `${PLAN_NAMES[plan]} plan · ${propertyLabel(propertyType)} · ${propertyArea} · 1 month`,
        customer_email: user.email,
        status: "PENDING",
        plan_request: planRequest as unknown as Prisma.InputJsonValue,
      },
    });
    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Failed to create plan:", error);
    return NextResponse.json({ message: "Failed to create the plan." }, { status: 500 });
  }
}
