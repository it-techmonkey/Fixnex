import { NextRequest, NextResponse } from "next/server";
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

  return bookingRoutes.detail.DELETE(request, id);
}

