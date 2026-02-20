import { NextRequest } from "next/server";
import { bookingCartItemRoutes } from "../bookingCartItem.routes";

export async function POST(request: NextRequest) {
  return bookingCartItemRoutes.booking.POST(request);
}


