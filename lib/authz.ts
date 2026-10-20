import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getVerifiedUser, type SessionUser } from "@/lib/session";

/** Requires a signed-in user. Returns the user, or a 401 response to send back. */
export async function requireUser(
  request: NextRequest
): Promise<{ user: SessionUser } | NextResponse> {
  const user = await getVerifiedUser(request);
  if (!user) {
    return NextResponse.json({ message: "Authentication required." }, { status: 401 });
  }
  return { user };
}

export const isAdminUser = (user: SessionUser) => user.role === "ADMIN";

export const forbidden = () =>
  NextResponse.json({ message: "Access denied." }, { status: 403 });
