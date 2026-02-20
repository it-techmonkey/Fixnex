import { NextRequest } from "next/server";
import { serviceRoutes } from "./services.routes";

export async function GET(request: NextRequest) {
  return serviceRoutes.collection.GET(request);
}
