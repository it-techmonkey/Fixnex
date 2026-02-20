import { NextRequest } from "next/server";
import { BookingsController } from "./bookings.controller";

const controller = new BookingsController();

export const bookingRoutes = {
  collection: {
    GET: (request: NextRequest) => controller.list(request),
    POST: (request: NextRequest) => controller.create(request),
  },
  byUser: {
    GET: (request: NextRequest, userId: string) => controller.listByUser(request, userId),
  },
  detail: {
    GET: (request: NextRequest, id: string) => controller.detail(request, id),
    PATCH: (request: NextRequest, id: string) => controller.update(request, id),
    DELETE: (request: NextRequest, id: string) => controller.remove(request, id),
  },
};

