import { NextRequest } from "next/server";
import { ServicesController } from "./services.controller";

const controller = new ServicesController();

export const serviceRoutes = {
  collection: {
    GET: (request: NextRequest) => controller.list(request),
  },
  detail: {
    GET: (request: NextRequest, id: string) => controller.detail(request, id),
  },
};

