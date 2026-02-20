import { NextRequest } from "next/server";
import { BookingCartItemController } from "./bookingCartItem.controller";

const controller = new BookingCartItemController();

export const bookingCartItemRoutes = {
  collection: {
    GET: (request: NextRequest) => controller.list(request),
    POST: (request: NextRequest) => controller.create(request),
  },
  detail: {
    DELETE: (request: NextRequest, itemId: string) => controller.delete(request, itemId),
    PATCH: (request: NextRequest, itemId: string) => controller.update(request, itemId),
  },
  booking: {
    POST: (request: NextRequest) => controller.createBookingFromItems(request),
  },
};

