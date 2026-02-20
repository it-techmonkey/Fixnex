import { NextRequest, NextResponse } from "next/server";
import { bookingCartItemRoutes } from "../bookingCartItem.routes";

type RouteParams = { params: Promise<{ id: string }> };

export async function DELETE(request: NextRequest, context: RouteParams) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ message: "Booking cart item ID is required." }, { status: 400 });
  }

  return bookingCartItemRoutes.detail.DELETE(request, id);
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  const { id } = await context.params;
  if (!id) {
    return NextResponse.json({ message: "Booking cart item ID is required." }, { status: 400 });
  }

  return bookingCartItemRoutes.detail.PATCH(request, id);
}


