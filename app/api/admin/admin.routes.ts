import { NextRequest } from "next/server";
import { AdminController } from "./admin.controller";

const controller = new AdminController();

export const adminRoutes = {
  dashboard: {
    GET: (request: NextRequest) => controller.dashboard(request),
  },
};


