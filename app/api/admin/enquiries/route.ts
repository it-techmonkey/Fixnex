import { NextRequest, NextResponse } from "next/server";
import type { EnquiryStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

const STATUSES: EnquiryStatus[] = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const params = request.nextUrl.searchParams;
    const status = params.get("status")?.toUpperCase() as EnquiryStatus | undefined;
    const search = params.get("search")?.trim();

    const where: Prisma.EnquiryWhereInput = {};
    if (status && STATUSES.includes(status)) where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
        { plan_name: { contains: search, mode: "insensitive" } },
        { property_label: { contains: search, mode: "insensitive" } },
      ];
    }

    const [enquiries, grouped] = await Promise.all([
      prisma.enquiry.findMany({
        where,
        orderBy: { created_at: "desc" },
        take: 500,
        include: { user: { select: { customer_code: true } } },
      }),
      prisma.enquiry.groupBy({ by: ["status"], _count: { _all: true } }),
    ]);

    const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<EnquiryStatus, number>;
    for (const row of grouped) counts[row.status] = row._count._all;

    return NextResponse.json({ enquiries, counts });
  } catch (error) {
    console.error("Failed to load enquiries:", error);
    return NextResponse.json({ message: "Failed to load enquiries." }, { status: 500 });
  }
}
