import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { getSessionFromRequest } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

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
  const session = getSessionFromRequest(request);
  if (!session?.userId) {
    return NextResponse.json(
      { message: "Authentication required." },
      { status: 401 }
    );
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, fullName: true, role: true },
  });

  if (!user || user.role !== "ADMIN") {
    return NextResponse.json(
      { message: "Admin access required." },
      { status: 403 }
    );
  }

  return { user: user as AdminUser };
}
