import { NextRequest, NextResponse } from "next/server";
import { cartRoutes } from "../cart.routes";

type RouteParams = { params: Promise<{ userId: string }> };

export async function GET(request: NextRequest, context: RouteParams) {
  const { userId } = await context.params;
  if (!userId) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 });
  }
  return cartRoutes.detail.GET(request, userId);
}

export async function PATCH(request: NextRequest, context: RouteParams) {
  const { userId } = await context.params;
  if (!userId) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 });
  }
  return cartRoutes.detail.PATCH(request, userId);
}

