import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { getVerifiedUser } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { bookingRoutes } from "../bookings.routes";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
  }

  return bookingRoutes.detail.GET(request, id);
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
  }

  // Editing a booking is an admin action.
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  return bookingRoutes.detail.PATCH(request, id);
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ message: "Booking ID is required." }, { status: 400 });
  }

  // Admins may delete any booking; customers only their own.
  const user = await getVerifiedUser(request);
  if (!user) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }
  if (user.role !== "ADMIN") {
    const booking = await prisma.booking.findUnique({
      where: { id },
      select: { user_id: true },
    });
    if (!booking || booking.user_id !== user.id) {
      return NextResponse.json({ message: "Booking not found." }, { status: 404 });
    }
  }

  return bookingRoutes.detail.DELETE(request, id);
}

