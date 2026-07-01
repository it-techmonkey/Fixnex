import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const links = await prisma.customPaymentLink.findMany({
      orderBy: { created_at: "desc" },
    });
    return NextResponse.json({ links });
  } catch (error) {
    console.error("Failed to fetch custom payment links:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  try {
    const body = await request.json();
    const { amount, description, customer_email } = body;

    if (!amount || !description) {
      return NextResponse.json({ error: "Amount and description are required" }, { status: 400 });
    }

    const link = await prisma.customPaymentLink.create({
      data: {
        amount: amount.toString(),
        description,
        customer_email: customer_email || null,
        status: "PENDING",
      },
    });

    return NextResponse.json({ link }, { status: 201 });
  } catch (error) {
    console.error("Failed to create custom payment link:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
