import { NextRequest } from "next/server";
import { adminRoutes } from "./admin.routes";

export async function GET(request: NextRequest) {
  return adminRoutes.dashboard.GET(request);
}


