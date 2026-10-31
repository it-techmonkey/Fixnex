import { NextRequest, NextResponse } from "next/server";
import type { EnquiryStatus } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

const STATUSES: EnquiryStatus[] = ["NEW", "CONTACTED", "CONVERTED", "CLOSED"];

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { id } = await params;
  const body = (await request.json().catch(() => null)) as { status?: string; adminNote?: string } | null;
  if (!body) return NextResponse.json({ message: "Invalid request." }, { status: 400 });

  const data: { status?: EnquiryStatus; admin_note?: string | null } = {};
  if (body.status !== undefined) {
    const status = String(body.status).toUpperCase() as EnquiryStatus;
    if (!STATUSES.includes(status)) return NextResponse.json({ message: "Invalid status." }, { status: 400 });
    data.status = status;
  }
  if (body.adminNote !== undefined) {
    data.admin_note = typeof body.adminNote === "string" ? body.adminNote.trim().slice(0, 2000) || null : null;
  }

  try {
    const enquiry = await prisma.enquiry.update({ where: { id }, data });
    return NextResponse.json({ enquiry });
  } catch (error) {
    console.error("Failed to update enquiry:", error);
    return NextResponse.json({ message: "Enquiry not found." }, { status: 404 });
  }
}
