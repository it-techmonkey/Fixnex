import { NextRequest } from "next/server";
import { authRoutes } from "../auth.routes";

export async function GET(request: NextRequest) {
  const handler = authRoutes.session.GET;

  if (!handler) {
    throw new Error("Session GET handler is not defined");
  }

  return handler(request);
}

