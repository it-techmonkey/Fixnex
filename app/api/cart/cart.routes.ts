import { NextRequest } from "next/server";
import { CartController } from "./cart.controller";

const controller = new CartController();

export const cartRoutes = {
  detail: {
    GET: (request: NextRequest, userId: string) => controller.detail(request, userId),
    PATCH: (request: NextRequest, userId: string) => controller.update(request, userId),
  },
};

