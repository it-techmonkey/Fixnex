import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/requireAdmin";
import { bookingRoutes } from "./bookings.routes";

export async function GET(request: NextRequest) {
  // Lists every customer's bookings, so only admins may call it.
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  return bookingRoutes.collection.GET(request);
}

export async function POST(request: NextRequest) {
  return bookingRoutes.collection.POST(request);
}

