import { NextRequest, NextResponse } from "next/server";
import { authRoutes, type RouteHandler } from "../auth.routes";

const getHandler = (
  action: string | undefined,
  method: "POST"
): RouteHandler | null => {
  if (!action) return null;
  const group = authRoutes[action as keyof typeof authRoutes];
  if (!group) return null;
  return group[method] ?? null;
};

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ action: string }> }
) {
  const params = await context.params;
  const handler = getHandler(params?.action, "POST");

  if (!handler) {
    return NextResponse.json({ message: "Not found" }, { status: 404 });
  }

  return handler(request);
}



