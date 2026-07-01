import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/requireAdmin";

export async function GET(request: NextRequest) {
  const auth = await requireAdmin(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search")?.toLowerCase() || "";

  try {
    // 1. Fetch payments with their parent orders
    const payments = await prisma.payment.findMany({
      orderBy: { created_at: "desc" },
      include: {
        payment_order: true
      }
    });

    // 2. Fetch User Info
    const userIds = [...new Set(payments.map(p => p.payment_order.user_id))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, fullName: true, email: true }
    });
    const userMap = new Map(users.map(u => [u.id, u]));

    // 3. Fetch Booking Info (for Successful Payments)
    const bookingIds = [...new Set(payments.map(p => p.booking_id).filter(Boolean) as string[])];
    const bookings = await prisma.booking.findMany({
      where: { id: { in: bookingIds } },
      select: { id: true, category_name: true, service_type: true }
    });
    const bookingMap = new Map(bookings.map(b => [b.id, b]));

    // 4. Fetch Cart Items (for Failed Payments)
    const cartItemIds = [...new Set(payments.flatMap(p => p.payment_order.booking_cart_items))];
    const cartItems = await prisma.bookingCartItem.findMany({
      where: { id: { in: cartItemIds } },
      include: { services: { select: { name: true } } }
    });
    const cartItemMap = new Map(cartItems.map(item => [item.id, item]));

    // 5. Format Data
    let formattedPayments = payments.map(payment => {
      const user = userMap.get(payment.payment_order.user_id);
      
      // Try to get name from Booking first
      const booking = payment.booking_id ? bookingMap.get(payment.booking_id) : null;
      let serviceName = "Multiple Services";
      
      if (booking && (booking.category_name || booking.service_type)) {
        serviceName = `${booking.category_name || ''} ${booking.service_type ? `(${booking.service_type})` : ''}`.trim();
      } else {
        // Fallback to cart item if booking is missing (e.g. failed payment)
        const firstCartItemId = payment.payment_order.booking_cart_items[0];
        const cartItem = firstCartItemId ? cartItemMap.get(firstCartItemId) : null;
        if (cartItem && cartItem.services) {
          serviceName = cartItem.services.name;
          if (payment.payment_order.booking_cart_items.length > 1) {
            serviceName += ` + ${payment.payment_order.booking_cart_items.length - 1} more`;
          }
        } else {
          serviceName = "Service Booking";
        }
      }

      return {
        id: payment.id,
        transaction_id: payment.transaction_id || "N/A",
        tracking_id: payment.tracking_id || "N/A",
        amount: payment.amount,
        status: payment.status,
        created_at: payment.created_at,
        service_name: serviceName,
        user: user ? { id: user.id, name: user.fullName, email: user.email } : { id: "Unknown", name: "Unknown", email: "" },
        booking_id: payment.booking_id,
        payment_mode: (payment.raw_response as any)?.payment_mode || "Unknown",
        card_name: (payment.raw_response as any)?.card_name || "Unknown",
      };
    });

    // 5. Apply Client-side style search filter if provided
    if (search) {
      formattedPayments = formattedPayments.filter(p => 
        p.user.name.toLowerCase().includes(search) ||
        p.user.id.toLowerCase().includes(search) ||
        p.transaction_id.toLowerCase().includes(search) ||
        p.amount.toLowerCase().includes(search) ||
        p.service_name.toLowerCase().includes(search)
      );
    }

    return NextResponse.json(formattedPayments);
  } catch (error) {
    console.error("Failed to fetch payments:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
