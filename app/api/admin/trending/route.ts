import { NextRequest } from "next/server";
import { AdminController } from "../admin.controller";

const controller = new AdminController();

export async function GET(request: NextRequest) {
  return controller.trendingServices(request);
}

