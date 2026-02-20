"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Icons from "@/app/components/icons";
import { useRouter } from "next/navigation";

type SessionState = {
  loading: boolean;
  isAuthenticated: boolean;
  userId?: string;
};

type CartService = {
  id: string;
  name: string;
  normal_price: string;
  member_price: string;
  icon: string;
  scheduledDate?: string | null;
  timeSlot?: string | null;
  location?: string | null;
  serviceType?: string | null;
  bookingCartItemId?: string;
};

type BookingCartItem = {
  id: string;
  price?: string | null;
  category_name?: string | null;
  location?: string | null;
  service_type?: string | null;
  scheduled_date?: string | null;
  time_slot?: string | null;
  services?: CartService;
  cart?: {
    id: string;
    user_id: string;
  } | null;
  booking_id?: string | null;
};

const CartPage = () => {
  const router = useRouter();
  const [session, setSession] = useState<SessionState>({
    loading: true,
    isAuthenticated: false,
    userId: undefined,
  });
  const [services, setServices] = useState<CartService[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<string | null>(null);

  const formatDate = (value?: string | null) => {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          const userId = data?.user?.id;
          setSession({ loading: false, isAuthenticated: true, userId });
        } else {
          setSession({ loading: false, isAuthenticated: false, userId: undefined });
        }
      } catch (error) {
        console.error("Failed to load session:", error);
        if (!cancelled) {
          setSession({ loading: false, isAuthenticated: false, userId: undefined });
        }
      }
    };

    loadSession();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadCart = async () => {
      if (!session.isAuthenticated || !session.userId) {
        setServices([]);
        setCartLoading(false);
        return;
      }

      try {
        setCartLoading(true);
        const response = await fetch(`/api/booking-cart-items`, {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data?.items) ? (data.items as BookingCartItem[]) : [];
          const userServices = items
            .filter(
              (
                item
              ): item is BookingCartItem & {
                services: CartService;
                cart: { id: string; user_id: string };
              } => {
                if (!item?.services) {
                  return false;
                }

                return item.cart?.user_id === session.userId && !item.booking_id;
              }
            )
            .map((item) => {
              const svc = item.services;
              return {
                id: svc.id,
                name: svc.name,
                normal_price: item.price ?? svc.normal_price,
                member_price: svc.member_price,
                icon: svc.icon,
                scheduledDate: item.scheduled_date ?? null,
                timeSlot: item.time_slot ?? null,
                location: item.location ?? null,
                serviceType: item.service_type ?? null,
                bookingCartItemId: item.id,
              };
            });

          setServices(userServices);
        } else {
          setServices([]);
        }
      } catch (error) {
        console.error("Failed to fetch cart:", error);
        if (!cancelled) {
          setServices([]);
        }
      } finally {
        if (!cancelled) {
          setCartLoading(false);
        }
      }
    };

    if (!session.loading) {
      loadCart();
    }

    return () => {
      cancelled = true;
    };
  }, [session.loading, session.isAuthenticated, session.userId]);

  const handleRemoveService = async (serviceId: string) => {
    if (!session.isAuthenticated || !session.userId) {
      router.push("/login?redirect=/cart");
      return;
    }

    const targetService = services.find((svc) => svc.id === serviceId);

    try {
      setIsUpdating(true);
      if (!targetService?.bookingCartItemId) {
        console.warn("Missing booking cart item id for service. Falling back to cart update.");
        const nextServiceIds = services.filter((svc) => svc.id !== serviceId).map((svc) => svc.id);
        const response = await fetch(`/api/cart/${session.userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ serviceIds: nextServiceIds }),
        });

        if (!response.ok) {
          throw new Error("Failed to update cart");
        }

        setServices((prev) => prev.filter((svc) => svc.id !== serviceId));
        return;
      }

      const response = await fetch(`/api/booking-cart-items/${targetService.bookingCartItemId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "Failed to remove booking cart item.");
      }

      setServices((prev) => prev.filter((svc) => svc.id !== serviceId));
    } catch (error) {
      console.error("Failed to remove service:", error);
      alert("We couldn't remove this service from your cart. Please try again.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCheckout = async () => {
    if (!session.isAuthenticated || !session.userId) {
      router.push("/login?redirect=/cart");
      return;
    }

    if (services.length === 0) {
      alert("Your cart is empty. Add services before booking.");
      return;
    }

    try {
      setIsUpdating(true);
      setBookingMessage(null);

      const bookingCartItemIds = services
        .map((svc) => svc.bookingCartItemId)
        .filter((id): id is string => typeof id === "string" && id.length > 0);

      if (bookingCartItemIds.length === 0) {
        alert("We couldn't determine which items to book. Please refresh and try again.");
        return;
      }

      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          bookingCartItemIds,
          userId: session.userId,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to create booking.");
      }

      setBookingMessage("Booking created successfully! We'll reach out shortly to confirm.");
      setServices([]);

      try {
        await fetch(`/api/cart/${session.userId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ serviceIds: [] }),
        });
      } catch (error) {
        console.error("Failed to clear cart after booking:", error);
      }
    } catch (error) {
      console.error("Failed to create booking:", error);
      setBookingMessage(
        error instanceof Error ? error.message : "We couldn't create your booking. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };

  const totalPrice = useMemo(() => {
    return services.reduce((sum, svc) => {
      const parsed = parseFloat(svc.normal_price);
      if (Number.isNaN(parsed)) {
        return sum;
      }
      return sum + parsed;
    }, 0);
  }, [services]);

  const formattedTotal = `AED ${totalPrice.toFixed(2)}`;

  const renderContent = () => {
    if (session.loading || cartLoading) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-white space-y-4">
          <div className="size-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/80 text-lg font-['Space_Grotesk']">Loading your cart...</p>
        </div>
      );
    }

    if (!session.isAuthenticated) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-white space-y-4 sm:space-y-6 px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk']">You are not signed in</h2>
          <p className="text-white/70 text-sm sm:text-base max-w-lg">
            Please log in to view and manage your cart. We'll bring you right back here afterward.
          </p>
          <button
            onClick={() => router.push("/login?redirect=/cart")}
            className="px-6 py-3 text-sm sm:text-base bg-white text-black rounded-lg font-semibold font-['Space_Grotesk'] hover:bg-gray-200 transition"
          >
            Log In
          </button>
        </div>
      );
    }

    if (services.length === 0) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-white space-y-4 sm:space-y-6 px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk']">Your cart is empty</h2>
          <p className="text-white/70 text-sm sm:text-base max-w-lg">
            Explore our services and add what you need. We're ready to take care of your space.
          </p>
          <button
            onClick={() => router.push("/services")}
            className="px-6 py-3 text-sm sm:text-base bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Browse Services
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-8 sm:space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {services.map((svc) => {
              const IconComponent = Icons[svc.icon as keyof typeof Icons];
              const formattedDate = formatDate(svc.scheduledDate) ?? svc.scheduledDate ?? undefined;
              return (
                <div
                  key={svc.id}
                  className="bg-[#17181b] border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 hover:border-blue-500/60 transition"
                >
                  <div className="size-16 sm:size-20 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                    {IconComponent && <IconComponent width={36} height={36} />}
                  </div>
                  <div className="flex-1 min-w-0 w-full sm:w-auto">
                    <h3 className="text-white text-lg sm:text-xl font-semibold font-['Space_Grotesk'] truncate">
                      {svc.name}
                    </h3>
                    <p className="text-white/80 text-sm sm:text-base mt-1">
                      Price:{" "}
                      <span className="text-white font-semibold">
                        {isNaN(parseFloat(svc.normal_price))
                          ? svc.normal_price
                          : `AED ${parseFloat(svc.normal_price).toFixed(2)}`}
                      </span>
                    </p>
                    {/* <p className="text-white/60 text-sm ">
                      Member price:{" "}
                      <span className="text-emerald-400 font-semibold">
                        {isNaN(parseFloat(svc.member_price))
                          ? svc.member_price
                          : `AED ${parseFloat(svc.member_price).toFixed(2)}`}
                      </span>
                    </p> */}
                    {(svc.scheduledDate || svc.timeSlot || svc.location) && (
                      <div className="mt-3 space-y-1 text-white/60 text-sm sm:text-base">
                        {formattedDate && (
                          <p>
                            <span className="text-white font-semibold">Schedule:</span>{" "}
                            {formattedDate}
                          </p>
                        )}
                        {svc.timeSlot && (
                          <p>
                            <span className="text-white font-semibold">Time:</span> {svc.timeSlot}
                          </p>
                        )}
                        {svc.location && (
                          <p>
                            <span className="text-white font-semibold">Location:</span>{" "}
                            {svc.location}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveService(svc.id)}
                    disabled={isUpdating}
                    className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base border border-white/30 text-white rounded-lg font-['Space_Grotesk'] hover:bg-white/10 disabled:opacity-60 disabled:cursor-not-allowed transition"
                  >
                    Remove
                  </button>
                </div>
              );
            })}
          </div>

          <aside className="bg-[#17181b] border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 flex flex-col gap-4 sm:gap-6 lg:sticky lg:top-24 lg:self-start">
            <div>
              <h3 className="text-white text-xl sm:text-2xl font-semibold font-['Space_Grotesk']">Order Summary</h3>
              <p className="text-white/60 text-sm sm:text-base mt-2">
                Review your selected services and proceed to book your visit.
              </p>
            </div>

            <div className="space-y-2 sm:space-y-3">
              {services.map((svc) => (
                <div key={svc.id} className="flex items-center justify-between text-white/80 text-sm sm:text-base">
                  <span className="truncate pr-2">{svc.name}</span>
                  <span className="font-semibold font-['Space_Grotesk'] shrink-0">
                    {isNaN(parseFloat(svc.normal_price))
                      ? svc.normal_price
                      : `AED ${parseFloat(svc.normal_price).toFixed(2)}`}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-700 pt-3 sm:pt-4">
              <div className="flex items-center justify-between text-base sm:text-lg text-white font-semibold font-['Space_Grotesk']">
                <span>Total</span>
                <span>{formattedTotal}</span>
              </div>
            </div>

            <button
              disabled={isUpdating || services.length === 0}
              onClick={handleCheckout}
              className="w-full py-3 text-sm sm:text-base bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {isUpdating ? "Processing…" : "Book Now"}
            </button>

            {bookingMessage && (
              <div className="p-3 rounded-lg border border-blue-500/40 bg-blue-500/10 text-white/80 text-xs sm:text-sm">
                {bookingMessage}
              </div>
            )}
          </aside>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full bg-[#0f0f0f] min-h-screen">
      <div className="w-full bg-[#0f0f0f] pt-20 relative z-10">
        <Header />
        <div className="w-full bg-black min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8 sm:space-y-10">
            <div>
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold font-['Space_Grotesk']">Your Cart</h1>
              <p className="text-white/60 text-sm sm:text-base mt-2">
                Review your selected services and proceed when you're ready.
              </p>
              <div className="mt-4">
                <button
                  onClick={() => (window.location.href = "/bookings")}
                  className="px-4 py-2 text-sm sm:text-base border border-white/30 text-white rounded-lg font-['Space_Grotesk'] hover:bg-white/10 transition"
                >
                  View Bookings
                </button>
              </div>
            </div>

            {renderContent()}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default CartPage;

