import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLAN_NAMES, RENEW_WINDOW_DAYS, addDays, formatPlanDate, type PlanTierName } from "@/lib/plans";
import { sendPlanExpiredEmail, sendPlanReminderEmail } from "@/lib/planEmails";

export const dynamic = "force-dynamic";

/**
 * Runs once a day (see vercel.json). Plans never renew or charge automatically; this only emails:
 *  - a reminder 5 days before a plan ends (if next month isn't paid yet)
 *  - a notice when a plan has ended without being renewed
 * Vercel sends `Authorization: Bearer <CRON_SECRET>`.
 */
export async function GET(request: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ message: "Unauthorized." }, { status: 401 });
  }

  const now = new Date();
  let reminders = 0;
  let expiries = 0;

  try {
    const hasLaterMonth = async (userId: string, endsAt: Date) =>
      (await prisma.subscription.count({
        where: { user_id: userId, status: "ACTIVE", starts_at: { gte: endsAt } },
      })) > 0;

    const ending = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        reminder_sent_at: null,
        starts_at: { lte: now },
        ends_at: { gt: now, lte: addDays(now, RENEW_WINDOW_DAYS) },
      },
      include: { user: { select: { email: true, fullName: true } } },
      take: 200,
    });
    for (const period of ending) {
      if (!(await hasLaterMonth(period.user_id, period.ends_at))) {
        await sendPlanReminderEmail({
          to: period.user.email,
          customerName: period.user.fullName || "there",
          planName: PLAN_NAMES[period.plan as PlanTierName],
          endsOn: formatPlanDate(period.ends_at),
        });
        reminders++;
      }
      await prisma.subscription.update({ where: { id: period.id }, data: { reminder_sent_at: now } });
    }

    const ended = await prisma.subscription.findMany({
      where: {
        status: "ACTIVE",
        expiry_notice_sent_at: null,
        ends_at: { gt: addDays(now, -3), lte: now },
      },
      include: { user: { select: { email: true, fullName: true } } },
      take: 200,
    });
    for (const period of ended) {
      if (!(await hasLaterMonth(period.user_id, period.ends_at))) {
        await sendPlanExpiredEmail({
          to: period.user.email,
          customerName: period.user.fullName || "there",
          planName: PLAN_NAMES[period.plan as PlanTierName],
        });
        expiries++;
      }
      await prisma.subscription.update({ where: { id: period.id }, data: { expiry_notice_sent_at: now } });
    }

    return NextResponse.json({ reminders, expiries });
  } catch (error) {
    console.error("Plan reminder job failed:", error);
    return NextResponse.json({ message: "Plan reminder job failed.", reminders, expiries }, { status: 500 });
  }
}
