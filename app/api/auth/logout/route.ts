import { NextRequest } from "next/server";
import { authRoutes } from "../auth.routes";

export async function POST(request: NextRequest) {
  const handler = authRoutes.logout.POST;

  if (!handler) {
    throw new Error("Logout POST handler is not defined");
  }

  return handler(request);
}

