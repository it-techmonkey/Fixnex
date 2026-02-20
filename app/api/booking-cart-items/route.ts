import { NextRequest } from "next/server";
import { bookingCartItemRoutes } from "./bookingCartItem.routes";

export async function GET(request: NextRequest) {
  return bookingCartItemRoutes.collection.GET(request);
}

export async function POST(request: NextRequest) {
  return bookingCartItemRoutes.collection.POST(request);
}


