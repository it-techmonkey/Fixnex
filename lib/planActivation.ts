import type { Prisma, Subscription } from "@prisma/client";
import { PLAN_RULES, addOneMonth, toMoney, type PlanTierName } from "@/lib/plans";
import { generatePlanCode, generateUpgradeCode } from "@/lib/readableIds";
import { getLivePeriods, lockCustomerPlans, type PlanRequest } from "@/lib/membership";

type Tx = Prisma.TransactionClient;

/**
 * Adds one paid month for a customer. It starts now, or straight after the month they already
 * have, so paying early never loses days. Must run inside a transaction.
 */
export async function activatePlanMonth(
  tx: Tx,
  options: {
    userId: string;
    plan: PlanTierName;
    propertyType: string;
    propertyArea: string;
    price: number;
    source: "online" | "payment_link" | "admin";
    paymentOrderId?: string | null;
    note?: string | null;
    now?: Date;
  }
): Promise<Subscription> {
  const now = options.now ?? new Date();
  await lockCustomerPlans(tx, options.userId);
  const periods = await getLivePeriods(tx, options.userId, now);
  const startsAt = periods.length ? periods[periods.length - 1].ends_at : now;

  return tx.subscription.create({
    data: {
      code: await generatePlanCode(tx, options.plan),
      user_id: options.userId,
      plan: options.plan,
      property_type: options.propertyType,
      property_area: options.propertyArea,
      price: toMoney(options.price).toFixed(2),
      visits_included: PLAN_RULES[options.plan].visitsPerMonth,
      status: "ACTIVE",
      starts_at: startsAt,
      ends_at: addOneMonth(startsAt),
      source: options.source,
      payment_order_id: options.paymentOrderId ?? null,
      admin_note: options.note ?? null,
    },
  });
}

/**
 * Switches the paid FixLite months in an upgrade request to FixPro. Months that are no longer
 * FixLite (e.g. a duplicate payment) are skipped; `upgraded` is then empty.
 */
export async function applyUpgrade(
  tx: Tx,
  request: PlanRequest,
  now = new Date()
): Promise<{ code: string; upgraded: Subscription[] }> {
  await lockCustomerPlans(tx, request.userId);
  const upgraded: Subscription[] = [];
  for (const target of request.targets ?? []) {
    const period = await tx.subscription.findFirst({
      where: { id: target.id, user_id: request.userId, status: "ACTIVE", plan: "FIXLITE", ends_at: { gt: now } },
    });
    if (!period) continue;
    upgraded.push(
      await tx.subscription.update({
        where: { id: period.id },
        data: { plan: "FIXPRO", visits_included: null, price: toMoney(target.newPrice).toFixed(2) },
      })
    );
  }
  return { code: await generateUpgradeCode(tx), upgraded };
}
