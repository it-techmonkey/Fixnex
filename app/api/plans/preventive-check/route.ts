import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";
import { getLivePeriods, lockCustomerPlans, periodAt, preventiveCheckStatus } from "@/lib/membership";
import { PLAN_NAMES, TIME_SLOTS, dubaiToday, formatPlanDate, type PlanTierName } from "@/lib/plans";
import { generatePreventiveCheckCode } from "@/lib/readableIds";
import { sendIncludedBookingEmail } from "@/lib/planEmails";

class CheckError extends Error {
  constructor(message: string, public status = 400) {
    super(message);
  }
}

/** Books the quarterly preventive check included in FixPro / FixMax (AED 0, plan property). */
export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;
  const userId = auth.user.id;

  const body = (await request.json().catch(() => null)) as { date?: string; timeSlot?: string } | null;
  const date = typeof body?.date === "string" ? body.date.trim() : "";
  const timeSlot = typeof body?.timeSlot === "string" ? body.timeSlot.trim() : "";

  try {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || Number.isNaN(new Date(`${date}T00:00:00Z`).getTime())) {
      throw new CheckError("Please choose a date.");
    }
    if (!TIME_SLOTS.includes(timeSlot)) throw new CheckError("Please choose a time slot.");
    if (date < dubaiToday()) throw new CheckError("Please choose a date from today onwards.");

    const result = await prisma.$transaction(async (tx) => {
      await lockCustomerPlans(tx, userId);
      const now = new Date();
      const periods = await getLivePeriods(tx, userId, now);
      const current = periodAt(periods, now);
      const status = await preventiveCheckStatus(tx, userId, current, now);
      if (!status.available || !current) throw new CheckError("Preventive checks are included in FixPro and FixMax.", 403);
      if (!status.eligible) throw new CheckError(status.reason ?? "You've already booked a preventive check recently.", 409);

      // The visit must fall inside a paid month (midday Dubai time on that date).
      const visitDate = new Date(`${date}T00:00:00Z`);
      if (!periodAt(periods, new Date(`${date}T08:00:00Z`))) {
        throw new CheckError(
          `Please choose a date before your plan ends on ${formatPlanDate(periods[periods.length - 1].ends_at)}.`
        );
      }

      const code = await generatePreventiveCheckCode(tx);
      await tx.booking.create({
        data: {
          booking_code: code,
          user_id: userId,
          category_name: "Plan benefit",
          location: current.property_area,
          service_type: "Quarterly preventive check",
          scheduled_date: visitDate,
          time_slot: timeSlot,
          price: "0.00",
          status: "PENDING",
          payment_status: "INCLUDED",
          member_plan: current.plan,
          subscription_id: current.id,
          property_scope: "PLAN",
          is_preventive_check: true,
        },
      });
      return { code, plan: current.plan as PlanTierName, area: current.property_area, visitDate };
    });

    const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, fullName: true } });
    if (user?.email) {
      await sendIncludedBookingEmail({
        to: user.email,
        customerName: user.fullName || "there",
        bookingCode: result.code,
        planName: PLAN_NAMES[result.plan],
        services: ["Quarterly preventive check"],
        date: formatPlanDate(result.visitDate),
        timeSlot,
        location: result.area,
      });
    }

    return NextResponse.json({ bookingCode: result.code });
  } catch (error) {
    if (error instanceof CheckError) return NextResponse.json({ message: error.message }, { status: error.status });
    console.error("Preventive check booking failed:", error);
    return NextResponse.json({ message: "We couldn't book your check. Please try again." }, { status: 500 });
  }
}
