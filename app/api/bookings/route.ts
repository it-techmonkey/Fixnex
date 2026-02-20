import { NextRequest } from "next/server";
import { bookingRoutes } from "./bookings.routes";

export async function GET(request: NextRequest) {
  return bookingRoutes.collection.GET(request);
}

export async function POST(request: NextRequest) {
  return bookingRoutes.collection.POST(request);
}

