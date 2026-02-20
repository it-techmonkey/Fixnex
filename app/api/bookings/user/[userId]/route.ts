import { NextRequest, NextResponse } from "next/server";
import { bookingRoutes } from "../../bookings.routes";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ userId: string }> }
) {
  const params = await context.params;
  const userId = params?.userId;

  if (!userId) {
    return NextResponse.json({ message: "User ID is required." }, { status: 400 });
  }

  return bookingRoutes.byUser.GET(request, userId);
}

