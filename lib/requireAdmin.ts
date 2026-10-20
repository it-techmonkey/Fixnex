import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getVerifiedUser } from "@/lib/session";

export type AdminUser = {
  id: string;
  email: string;
  fullName: string;
  role: string;
};

/**
 * Verifies the request has a valid session and the user has role ADMIN.
 * Returns the admin user if authorized, or a 401 NextResponse if not.
 */
export async function requireAdmin(
  request: NextRequest
): Promise<{ user: AdminUser } | NextResponse> {
  const user = await getVerifiedUser(request);
  if (!user) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  if (user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 403 }
    );
  }

  return { user: user as AdminUser };
}
