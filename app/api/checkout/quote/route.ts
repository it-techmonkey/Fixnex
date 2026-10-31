import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/authz";
import { quoteBooking, type PropertyScope } from "@/lib/membership";

export const dynamic = "force-dynamic";

/** Prices for the signed-in customer's cart items, exactly as checkout will charge them. */
export async function POST(request: NextRequest) {
  const auth = await requireUser(request);
  if (auth instanceof NextResponse) return auth;

  const body = (await request.json().catch(() => null)) as {
    bookingCartItemIds?: unknown;
    propertyScope?: PropertyScope;
  } | null;
  const ids = Array.isArray(body?.bookingCartItemIds)
    ? body!.bookingCartItemIds.filter((id): id is string => typeof id === "string" && id.length > 0)
    : [];

  try {
    const items = ids.length
      ? await prisma.bookingCartItem.findMany({
          where: { id: { in: ids }, booking_id: null, cart: { user_id: auth.user.id } },
          include: { services: { select: { name: true, normal_price: true, member_price: true } } },
        })
      : [];
    const quote = await quoteBooking(prisma, {
      userId: auth.user.id,
      items,
      propertyScope: body?.propertyScope,
    });
    return NextResponse.json({ quote });
  } catch (error) {
    console.error("Failed to price cart:", error);
    return NextResponse.json({ message: "Failed to load prices." }, { status: 500 });
  }
}
