"use client";

import { useEffect, useMemo, useState } from "react";
import PriceInfo, { servicePriceRows } from "@/app/components/common/PriceInfo";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Icons from "@/app/components/icons";
import { useRouter } from "next/navigation";
import { redirectToGateway } from "@/app/utils/gateway";
import { PLAN_NAMES, formatPlanDate, type PlanTierName } from "@/lib/plans";

type QuotedItem = {
  itemId: string;
  coverage: "INCLUDED" | "MEMBER" | "NORMAL";
  price: number;
  priceText: string | null;
  normalPrice: number | null;
  memberPrice: number | null;
  priority: boolean;
  note: string | null;
};

type CartQuote = {
  items: QuotedItem[];
  total: number;
  includedVisits: number;
  propertyScope: "PLAN" | "OTHER" | null;
  member: {
    plan: PlanTierName;
    propertyArea: string;
    endsAt: string;
    visitsAllowed: number | null;
    visitsUsed: number;
  } | null;
};

const aed = (value: number) => `AED ${value.toFixed(2)}`;

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
  const [showGuestForm, setShowGuestForm] = useState(false);
  const [guestDetails, setGuestDetails] = useState({ name: "", email: "", phone: "" });
  // Server-calculated prices for signed-in customers (plan included / member / normal price).
  const [quote, setQuote] = useState<CartQuote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [propertyScope, setPropertyScope] = useState<"PLAN" | "OTHER">("PLAN");

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
        try {
           const localData = localStorage.getItem("fixnex_guest_cart");
           if (localData) {
             setServices(JSON.parse(localData));
           } else {
             setServices([]);
           }
        } catch (e) {
           setServices([]);
        }
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

  const cartItemIds = useMemo(
    () => services.map((svc) => svc.bookingCartItemId).filter((id): id is string => !!id),
    [services]
  );

  const loadQuote = async (ids: string[], scope: "PLAN" | "OTHER") => {
    if (!session.isAuthenticated || ids.length === 0) {
      setQuote(null);
      return null;
    }
    setQuoteLoading(true);
    try {
      const response = await fetch("/api/checkout/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ bookingCartItemIds: ids, propertyScope: scope }),
      });
      if (!response.ok) throw new Error();
      const data = (await response.json()) as { quote: CartQuote };
      setQuote(data.quote);
      return data.quote;
    } catch {
      // Prices then show as listed; checkout still charges the correct server price.
      setQuote(null);
      return null;
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    if (!session.loading && !cartLoading) loadQuote(cartItemIds, propertyScope);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.loading, session.isAuthenticated, cartLoading, cartItemIds.join(","), propertyScope]);

  const quoteFor = (svc: CartService) =>
    quote?.items.find((q) => q.itemId === svc.bookingCartItemId) ?? null;

  const handleRemoveService = async (serviceId: string) => {
    if (!session.isAuthenticated || !session.userId) {
      const nextServices = services.filter((svc) => svc.id !== serviceId);
      setServices(nextServices);
      localStorage.setItem("fixnex_guest_cart", JSON.stringify(nextServices));
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
    if (services.length === 0) {
      alert("Your cart is empty. Add services before booking.");
      return;
    }

    let requestBody: any = {};

    if (!session.isAuthenticated || !session.userId) {
      if (!showGuestForm) {
        setShowGuestForm(true);
        return;
      }
      if (!guestDetails.name || !guestDetails.email || !guestDetails.phone) {
         setBookingMessage("Please fill in all your details to proceed.");
         return;
      }
      requestBody = {
         guestDetails,
         guestCartItems: services.map(svc => ({
            service_id: svc.id,
            category_name: null,
            location: svc.location,
            service_type: svc.serviceType,
            scheduled_date: svc.scheduledDate,
            time_slot: svc.timeSlot,
            price: svc.normal_price
         }))
      };
    } else {
      const bookingCartItemIds = services
        .map((svc) => svc.bookingCartItemId)
        .filter((id): id is string => typeof id === "string" && id.length > 0);

      if (bookingCartItemIds.length === 0) {
        alert("We couldn't determine which items to book. Please refresh and try again.");
        return;
      }
      requestBody = {
        bookingCartItemIds,
        propertyScope,
        // If prices changed since the customer looked (e.g. plan ended), they see the new prices first.
        ...(quote ? { expectedTotal: quote.total } : {}),
      };
    }

    try {
      setIsUpdating(true);
      setBookingMessage(null);

      // Initiate payment — server creates PaymentOrder and returns encrypted CCAvenue params
      const response = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(requestBody),
      });

      const data = await response.json().catch(() => null);
      if (!response.ok) {
        if (data?.code === "PRICE_CHANGED") {
          await loadQuote(cartItemIds, propertyScope);
          throw new Error("Your prices have been updated. Please check the new total and try again.");
        }
        throw new Error(data?.message ?? "Failed to initiate payment.");
      }

      // Nothing to pay (fully included in the plan): the booking is already confirmed.
      if (data?.confirmed) {
        const type = data.paymentStatus === "INCLUDED" ? "included" : "quote";
        router.push(`/payment/success?orderId=${encodeURIComponent(data.orderId)}&type=${type}`);
        return;
      }

      // Otherwise go to the CCAvenue payment page.
      redirectToGateway(data);
    } catch (error) {
      console.error("Failed to initiate payment:", error);
      setBookingMessage(
        error instanceof Error ? error.message : "We couldn't initiate payment. Please try again."
      );
    } finally {
      setIsUpdating(false);
    }
  };


  const totalPrice = useMemo(() => {
    if (quote) return quote.total;
    return services.reduce((sum, svc) => {
      const parsed = parseFloat(svc.normal_price);
      if (Number.isNaN(parsed)) {
        return sum;
      }
      return sum + parsed;
    }, 0);
  }, [services, quote]);

  const formattedTotal = `AED ${totalPrice.toFixed(2)}`;

  /** Price label for one cart line: from the server quote when available, else the listed price. */
  const priceLabel = (svc: CartService) => {
    const q = quoteFor(svc);
    if (q) return q.priceText ?? aed(q.price);
    return isNaN(parseFloat(svc.normal_price)) ? svc.normal_price : `AED ${parseFloat(svc.normal_price).toFixed(2)}`;
  };

  const checkoutLabel = () => {
    if (isUpdating) return "Processing…";
    if (quoteLoading) return "Checking prices…";
    if (session.isAuthenticated && quote && quote.total <= 0) return "Confirm booking";
    if (session.isAuthenticated && quote) return `Pay ${formattedTotal}`;
    return "Book Now";
  };

  const renderContent = () => {
    if (session.loading || cartLoading) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-white space-y-4">
          <div className="size-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/80 text-lg font-['Space_Grotesk']">Loading your cart...</p>
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
                      <span className="text-white font-semibold">{priceLabel(svc)}</span>
                      {(() => {
                        const q = quoteFor(svc);
                        if (q && q.coverage !== "NORMAL" && q.normalPrice !== null && q.price < q.normalPrice) {
                          return <span className="ml-2 text-white/40 line-through text-sm">{aed(q.normalPrice)}</span>;
                        }
                        return null;
                      })()}
                      <PriceInfo className="ml-1.5" title="Price breakdown" rows={servicePriceRows(svc)} note="Member price applies to FixNex plan members." />
                    </p>
                    {(() => {
                      const q = quoteFor(svc);
                      if (q?.coverage === "INCLUDED") {
                        return (
                          <p className="mt-1.5 inline-flex flex-wrap items-center gap-2 text-xs">
                            <span className="rounded-full bg-emerald-500/15 px-2.5 py-1 font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
                              Included in your {quote?.member ? PLAN_NAMES[quote.member.plan] : "plan"}
                            </span>
                            {q.priority && <span className="rounded-full bg-amber-500/15 px-2.5 py-1 font-semibold text-amber-300 ring-1 ring-amber-500/30">Priority</span>}
                          </p>
                        );
                      }
                      if (q?.coverage === "MEMBER") {
                        return (
                          <p className="mt-1.5 text-xs">
                            <span className="rounded-full bg-sky-500/15 px-2.5 py-1 font-semibold text-sky-300 ring-1 ring-sky-500/30">Member price</span>
                            {q.note && <span className="ml-2 text-white/50">{q.note}</span>}
                          </p>
                        );
                      }
                      if (q?.coverage === "NORMAL" && q.memberPrice !== null && q.normalPrice !== null && q.memberPrice < q.normalPrice) {
                        return (
                          <p className="mt-1.5 text-xs text-white/50">
                            Plan members pay {aed(q.memberPrice)}.{" "}
                            <a href="/#plans-pricing" className="text-sky-300 hover:text-sky-200">See plans</a>
                          </p>
                        );
                      }
                      return null;
                    })()}
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
                  <span className="font-semibold font-['Space_Grotesk'] shrink-0">{priceLabel(svc)}</span>
                </div>
              ))}
            </div>

            {quote?.member && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-3 sm:p-4 space-y-3 text-sm">
                <p className="text-white">
                  <span className="font-semibold">{PLAN_NAMES[quote.member.plan]} member</span>
                  <span className="text-white/60"> · until {formatPlanDate(quote.member.endsAt)}</span>
                </p>
                {quote.member.visitsAllowed !== null && (
                  <p className="text-white/60 text-xs">
                    Included visits this month: {Math.max(0, quote.member.visitsAllowed - quote.member.visitsUsed)} of{" "}
                    {quote.member.visitsAllowed} left
                  </p>
                )}
                <fieldset className="space-y-2">
                  <legend className="text-white/60 text-xs mb-1">Where is this booking for?</legend>
                  <label className="flex items-center gap-2 text-white/85 cursor-pointer">
                    <input
                      type="radio"
                      name="propertyScope"
                      checked={propertyScope === "PLAN"}
                      onChange={() => setPropertyScope("PLAN")}
                    />
                    My plan property ({quote.member.propertyArea})
                  </label>
                  <label className="flex items-center gap-2 text-white/85 cursor-pointer">
                    <input
                      type="radio"
                      name="propertyScope"
                      checked={propertyScope === "OTHER"}
                      onChange={() => setPropertyScope("OTHER")}
                    />
                    Another property (member prices)
                  </label>
                </fieldset>
              </div>
            )}

            {!session.isAuthenticated && (
              <p className="text-xs text-white/50">
                Have a FixNex plan?{" "}
                <a href="/login?redirect=%2Fcart" className="text-sky-300 hover:text-sky-200">Log in</a> to use your included
                visits and member prices.
              </p>
            )}

            <div className="border-t border-gray-700 pt-3 sm:pt-4">
              <div className="flex items-center justify-between text-base sm:text-lg text-white font-semibold font-['Space_Grotesk']">
                <span>Total</span>
                <span>
                  {formattedTotal}
                  <PriceInfo
                    className="ml-2"
                    title="Total breakdown"
                    rows={[
                      ...services.map((svc) => ({
                        label: svc.name,
                        value: priceLabel(svc),
                      })),
                      { label: "Total", value: formattedTotal, strong: true },
                    ]}
                  />
                </span>
              </div>
            </div>

            {showGuestForm && !session.isAuthenticated && (
              <div className="space-y-3 mt-4 border-t border-gray-700 pt-4">
                <h4 className="text-white text-lg font-semibold font-['Space_Grotesk']">Guest Details</h4>
                <input 
                  type="text" 
                  placeholder="Full Name" 
                  value={guestDetails.name}
                  onChange={(e) => setGuestDetails(prev => ({...prev, name: e.target.value}))}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
                <input 
                  type="email" 
                  placeholder="Email Address" 
                  value={guestDetails.email}
                  onChange={(e) => setGuestDetails(prev => ({...prev, email: e.target.value}))}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
                <input 
                  type="tel" 
                  placeholder="Phone Number" 
                  value={guestDetails.phone}
                  onChange={(e) => setGuestDetails(prev => ({...prev, phone: e.target.value}))}
                  className="w-full bg-black/50 border border-gray-700 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-blue-500 transition"
                />
              </div>
            )}

            <button
              disabled={isUpdating || quoteLoading || services.length === 0}
              onClick={handleCheckout}
              className="w-full py-3 text-sm sm:text-base bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30"
            >
              {checkoutLabel()}
            </button>
            {session.isAuthenticated && quote && quote.total <= 0 && (
              <p className="text-xs text-white/50 text-center">Nothing to pay: this booking is included in your plan.</p>
            )}

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

