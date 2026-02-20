import { NextRequest, NextResponse } from "next/server";
import { serviceRoutes } from "../services.routes";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const params = await context.params;
  const id = params?.id;

  if (!id) {
    return NextResponse.json({ message: "Service ID is required." }, { status: 400 });
  }

  return serviceRoutes.detail.GET(request, id);
}

