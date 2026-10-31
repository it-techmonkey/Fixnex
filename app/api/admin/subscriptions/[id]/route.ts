import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";
import { lockCustomerPlans } from "@/lib/membership";
import { addDays } from "@/lib/plans";

/**
 * Admin actions on one plan month:
 *  - extend { days }: moves the end date (and any later paid months) by that many days
 *  - cancel: stops the plan now; member prices stop straight away
 *  - add_visit / remove_visit: changes the extra visits for this month
 *  - note { note }
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;
  const { id } = await params;

  const body = (await request.json().catch(() => null)) as { action?: string; days?: unknown; note?: unknown } | null;
  const action = body?.action;

  try {
    const result = await prisma.$transaction(async (tx) => {
      const period = await tx.subscription.findUnique({ where: { id } });
      if (!period) return { error: "Plan not found.", status: 404 };
      await lockCustomerPlans(tx, period.user_id);

      switch (action) {
        case "extend": {
          const days = Number(body?.days);
          if (!Number.isInteger(days) || days < 1 || days > 90) {
            return { error: "Enter between 1 and 90 days.", status: 400 };
          }
          if (period.status !== "ACTIVE") return { error: "Only active plans can be extended.", status: 400 };
          // Later paid months move too, so months never overlap.
          const later = await tx.subscription.findMany({
            where: { user_id: period.user_id, status: "ACTIVE", starts_at: { gte: period.ends_at }, id: { not: id } },
          });
          for (const next of later) {
            await tx.subscription.update({
              where: { id: next.id },
              data: { starts_at: addDays(next.starts_at, days), ends_at: addDays(next.ends_at, days) },
            });
          }
          return {
            subscription: await tx.subscription.update({
              where: { id },
              data: {
                ends_at: addDays(period.ends_at, days),
                reminder_sent_at: null,
                expiry_notice_sent_at: null,
                admin_note: appendNote(period.admin_note, `Extended by ${days} day(s) by ${auth.user.email}`),
              },
            }),
          };
        }
        case "cancel":
          if (period.status === "CANCELLED") return { error: "This plan is already cancelled.", status: 400 };
          return {
            subscription: await tx.subscription.update({
              where: { id },
              data: {
                status: "CANCELLED",
                cancelled_at: new Date(),
                admin_note: appendNote(period.admin_note, `Cancelled by ${auth.user.email}`),
              },
            }),
          };
        case "add_visit":
        case "remove_visit": {
          if (period.visits_included === null) return { error: "This plan already has unlimited visits.", status: 400 };
          const bonus = period.visits_bonus + (action === "add_visit" ? 1 : -1);
          if (bonus < 0) return { error: "There are no extra visits to remove.", status: 400 };
          return { subscription: await tx.subscription.update({ where: { id }, data: { visits_bonus: bonus } }) };
        }
        case "note":
          return {
            subscription: await tx.subscription.update({
              where: { id },
              data: { admin_note: typeof body?.note === "string" ? body.note.trim().slice(0, 1000) || null : null },
            }),
          };
        default:
          return { error: "Unknown action.", status: 400 };
      }
    });

    if ("error" in result) return NextResponse.json({ message: result.error }, { status: result.status });
    return NextResponse.json({ subscription: result.subscription });
  } catch (error) {
    console.error("Failed to update plan:", error);
    return NextResponse.json({ message: "Failed to update the plan." }, { status: 500 });
  }
}

const appendNote = (existing: string | null, line: string) =>
  [existing, `${new Date().toISOString().slice(0, 10)}: ${line}`].filter(Boolean).join("\n").slice(-1000);
