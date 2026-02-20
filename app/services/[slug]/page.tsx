"use client";

import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Icons from "@/app/components/icons";
import { slugify } from "@/app/utils/slugify";
import { getServiceImage } from "../service-images";

const formatPrice = (price: string | number | null | undefined) => {
  if (price === null || price === undefined) {
    return "AED 0";
  }

  if (typeof price === "number") {
    return `AED ${price}`;
  }

  const trimmed = price.trim();
  if (trimmed.length === 0) {
    return "AED 0";
  }

  if (/^aed\b/i.test(trimmed)) {
    return trimmed;
  }

  return /\d/.test(trimmed) ? `AED ${trimmed}` : trimmed;
};

type ApiService = {
  id: string;
  name: string;
  normal_price: string | number;
  member_price: string | number;
  icon: string;
  category: {
    id: string;
    name: string;
  } | null;
};

type SessionState = {
  loading: boolean;
  isAuthenticated: boolean;
  userId?: string;
};

type BookingCartItem = {
  id: string;
  cart?: {
    id: string;
    user_id: string;
  } | null;
  services?: {
    id: string;
    name: string;
    normal_price: string;
    member_price: string;
    icon: string;
  } | null;
  category_name?: string | null;
  location?: string | null;
  service_type?: string | null;
  scheduled_date?: string | null;
  time_slot?: string | null;
  price?: string | null;
  booking_id?: string | null;
};

const ServiceDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const [service, setService] = useState<ApiService | null>(null);
  const [categoryName, setCategoryName] = useState("");
  const [allServices, setAllServices] = useState<ApiService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [location, setLocation] = useState("Business Bay");
  const [locationSearch, setLocationSearch] = useState("");
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const [isCustomLocation, setIsCustomLocation] = useState(false);
  const [subType, setSubType] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<any>(null);
  const [session, setSession] = useState<SessionState>({
    loading: true,
    isAuthenticated: false,
  });
  const [cartLoading, setCartLoading] = useState(false);
  const [cartId, setCartId] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<BookingCartItem[]>([]);
  const [isUpdatingCart, setIsUpdatingCart] = useState(false);
  const dateInputRef = useRef<HTMLInputElement | null>(null);

  // Comprehensive list of Dubai localities
  const dubaiLocalities = [
    "Al Barsha",
    "Al Furjan",
    "Al Jaddaf",
    "Al Karama",
    "Al Khawaneej",
    "Al Mamzar",
    "Al Mankhool",
    "Al Mizhar",
    "Al Muhaisnah",
    "Al Nahda",
    "Al Qouz",
    "Al Quoz Industrial",
    "Al Qusais",
    "Al Rashidiya",
    "Al Rigga",
    "Al Safa",
    "Al Satwa",
    "Al Sufouh",
    "Al Wasl",
    "Al Warqa",
    "Arabian Ranches",
    "Arabian Ranches 2",
    "Arabian Ranches 3",
    "Barsha Heights (TECOM)",
    "Business Bay",
    "City Walk",
    "Culture Village",
    "Damac Hills",
    "Damac Hills 2",
    "Deira",
    "Discovery Gardens",
    "Downtown Dubai",
    "Dubai Creek Harbour",
    "Dubai Festival City",
    "Dubai Healthcare City",
    "Dubai Hills Estate",
    "Dubai Internet City",
    "Dubai Investment Park",
    "Dubai Marina",
    "Dubai Media City",
    "Dubai Production City",
    "Dubai Silicon Oasis",
    "Dubai South",
    "Dubai Sports City",
    "Dubai Studio City",
    "Dubailand",
    "Emirates Hills",
    "Emirates Living",
    "Green Community",
    "Greens",
    "International City",
    "Jebel Ali",
    "Jumeirah",
    "Jumeirah Beach Residence (JBR)",
    "Jumeirah Golf Estates",
    "Jumeirah Islands",
    "Jumeirah Lake Towers (JLT)",
    "Jumeirah Park",
    "Jumeirah Village Circle (JVC)",
    "Jumeirah Village Triangle (JVT)",
    "Mirdif",
    "Motor City",
    "Mudon",
    "Palm Jumeirah",
    "Reem",
    "Remraam",
    "Springs",
    "The Gardens",
    "The Greens",
    "The Lakes",
    "The Meadows",
    "The Sustainable City",
    "The Views",
    "Town Square",
    "Trade Centre",
    "Umm Suqeim",
    "Victory Heights",
    "Waterfront",
  ];

  // Filter localities based on search
  const filteredLocalities = useMemo(
    () =>
      dubaiLocalities.filter((locality) =>
        locality.toLowerCase().includes(locationSearch.toLowerCase())
      ),
    [locationSearch]
  );

  useEffect(() => {
    let isMounted = true;

    const loadService = async () => {
      try {
        setLoading(true);
        const listResponse = await fetch("/api/services");
        if (!listResponse.ok) {
          throw new Error("Failed to fetch services list.");
        }

        const listPayload = await listResponse.json();
        const services: ApiService[] = listPayload.services ?? [];

        if (!isMounted) return;
        setAllServices(services);

        const matched = services.find((item) => slugify(item.name) === slug);
        if (!matched) {
          setError("Service not found.");
          router.push("/services");
          return;
        }

        const detailResponse = await fetch(`/api/services/${matched.id}`);
        if (!detailResponse.ok) {
          throw new Error("Failed to fetch service.");
        }

        const detailPayload = await detailResponse.json();
        const detailService: ApiService | null = detailPayload.service ?? null;

        if (!detailService) {
          setError("Service not found.");
          router.push("/services");
          return;
        }

        setService(detailService);
        setCategoryName(detailService.category?.name ?? "");
        setError(null);
      } catch (err) {
        console.error("Error loading service:", err);
        if (isMounted) {
          setError("Unable to load this service. Please try again later.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadService();

    return () => {
      isMounted = false;
    };
  }, [slug, router]);

  useEffect(() => {
    let cancelled = false;

    const loadSession = async () => {
      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) {
          return;
        }

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
        setCartItems([]);
        setCartId(null);
        return;
      }

      try {
        setCartLoading(true);
        const response = await fetch(`/api/booking-cart-items`, {
          method: "GET",
          credentials: "include",
        });

        if (cancelled) {
          return;
        }

        if (response.ok) {
          const data = await response.json();
          const items = Array.isArray(data?.items) ? (data.items as BookingCartItem[]) : [];
          const userItems = items.filter(
            (item) => item.cart?.user_id === session.userId && !item.booking_id
          );
          setCartItems(userItems);

          let derivedCartId =
            userItems.find((item) => item.cart?.id)?.cart?.id ?? null;

          if (!derivedCartId) {
            const cartResponse = await fetch(`/api/cart/${session.userId}`, {
              method: "GET",
              credentials: "include",
            });

            if (cancelled) {
              return;
            }

            if (cartResponse.ok) {
              const cartData = await cartResponse.json();
              if (cartData?.cart?.id) {
                derivedCartId = cartData.cart.id;
              }
            }
          }

          setCartId(derivedCartId ?? null);
        } else {
          setCartItems([]);
          setCartId(null);
        }
      } catch (error) {
        console.error("Failed to fetch booking cart items:", error);
        if (!cancelled) {
          setCartItems([]);
          setCartId(null);
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

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.location-dropdown-container')) {
        setShowLocationDropdown(false);
      }
    };

    if (showLocationDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showLocationDropdown]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        Loading service...
      </div>
    );
  }

  if (error || !service) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        {error ?? "Service not found."}
      </div>
    );
  }

  const category = categoryName || "Services";
  const IconComponent = Icons[service.icon as keyof typeof Icons];
  const serviceImage = getServiceImage(service.name);

  if (!service) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  const isFormComplete = Boolean(location && subType && date && timeSlot);

  const handleCartToggle = async () => {
    if (session.loading) {
      return;
    }

    if (!session.isAuthenticated || !session.userId) {
      alert("Please log in to manage your cart.");
      router.push(`/login?redirect=${encodeURIComponent(`/services/${slug}`)}`);
      return;
    }

    if (!service) {
      return;
    }

    const existingItem = cartItems.find((item) => item.services?.id === service.id);

    if (!existingItem && !isFormComplete) {
      alert("Please fill in location, service type, date, and time before adding to cart.");
      return;
    }

    try {
      setIsUpdatingCart(true);
      if (existingItem) {
        const response = await fetch(`/api/booking-cart-items/${existingItem.id}`, {
          method: "DELETE",
          credentials: "include",
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.message ?? "Failed to remove service from cart.");
        }

        setCartItems((prev) => prev.filter((item) => item.id !== existingItem.id));
        return;
      }

      if (!cartId) {
        alert("We couldn't find your cart. Please refresh and try again.");
        return;
      }

      const response = await fetch(`/api/booking-cart-items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          cartId,
          serviceId: service.id,
          categoryName: categoryName || null,
          location,
          serviceType: subType || null,
          scheduledDate: date || null,
          timeSlot: timeSlot || null,
          price:
            typeof service.normal_price === "number"
              ? service.normal_price.toString()
              : service.normal_price ?? null,
        }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "Failed to add service to cart.");
      }

      const payload = (await response.json()) as { item?: BookingCartItem };
      if (payload?.item) {
        setCartItems((prev) => {
          const withoutExisting = prev.filter((item) => item.services?.id !== service.id);
          return [...withoutExisting, payload.item as BookingCartItem];
        });
      }
    } catch (error) {
      console.error("Failed to update cart:", error);
      alert("We couldn't update your cart. Please try again.");
    } finally {
      setIsUpdatingCart(false);
    }
  };

  const isServiceInCart = service
    ? cartItems.some((item) => item.services?.id === service.id)
    : false;
  const cartButtonDisabled =
    session.loading ||
    cartLoading ||
    isUpdatingCart ||
    !service ||
    (!isServiceInCart && !isFormComplete);
  const cartButtonLabel = session.loading
    ? "Checking session..."
    : cartLoading
    ? "Loading cart..."
    : isUpdatingCart
    ? isServiceInCart
      ? "Removing..."
      : "Adding..."
    : isServiceInCart
    ? "Remove from Cart"
    : "Add to Cart";

  return (
    <div className="w-full bg-[#0f0f0f] min-h-screen">
      <div className="w-full bg-[#0f0f0f] pt-20 relative z-10">
        <Header />
        
        <div className="w-full bg-black min-h-screen">
          <div className="max-w-7xl mx-auto px-6 py-12">
            
            {/* Breadcrumbs */}
            <div className="text-neutral-400 text-sm mb-8 ">
              <span className="hover:text-white cursor-pointer" onClick={() => router.push("/")}>Home</span>
              {" / "}
              <span className="hover:text-white cursor-pointer" onClick={() => router.push("/services")}>Services</span>
              {" / "}
              <span className="hover:text-white cursor-pointer" onClick={() => router.push("/services")}>{category}</span>
              {" / "}
              <span className="text-white">{service.name}</span>
            </div>

            {/* Main Service Detail Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
              
              {/* Left: Service Media */}
              <div className="relative">
                <div className="aspect-square rounded-2xl overflow-hidden border border-gray-700 bg-[#141518]">
                  {serviceImage ? (
                    <>
                      <Image
                        src={serviceImage.src}
                        alt={serviceImage.alt}
                        fill
                        className="object-cover"
                        sizes="(min-width: 1024px) 40vw, 100vw"
                      />
                      <div className="absolute inset-0 bg-linear-to-br from-black/45 via-black/20 to-transparent" />
                      {IconComponent && (
                        <div className="absolute top-5 left-5 size-16 sm:size-20 md:size-24 flex items-center justify-center rounded-2xl bg-white/10 border border-white/20 backdrop-blur-sm">
                          <IconComponent
                            width={40}
                            height={40}
                            className="hidden sm:block text-white"
                          />
                          <IconComponent width={28} height={28} className="sm:hidden text-white" />
                        </div>
                      )}
                      <div className="absolute bottom-4 left-5 right-5 text-white/70 text-[10px] uppercase tracking-widest">
                        <a
                          href={serviceImage.creditUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="truncate block hover:text-white"
                        >
                          Photo: {serviceImage.credit}
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="relative w-full h-full bg-linear-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                      <div className="absolute inset-0 opacity-5">
                        <div
                          className="absolute inset-0"
                          style={{
                            backgroundImage: "radial-gradient(circle, white 1px, transparent 1px)",
                            backgroundSize: "30px 30px",
                          }}
                        ></div>
                      </div>
                      <div className="relative z-10 size-64 flex items-center justify-center bg-white/10 rounded-3xl border-2 border-white/20">
                        {IconComponent && <IconComponent width={180} height={180} />}
                      </div>
                      <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-transparent to-emerald-500/20"></div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right: Service Details & Booking Form */}
              <div className="flex flex-col gap-6">
                
                {/* Service Title */}
                <div>
                  <h1 className="text-white text-4xl md:text-5xl font-bold font-['Space_Grotesk'] mb-3">
                    {service.name}
                  </h1>
                  <p className="text-gray-300 text-lg  leading-relaxed">
                    Professional {service.name.toLowerCase()} service in Dubai. Quality work guaranteed with experienced technicians.
                  </p>
                </div>

                {/* Rating */}
                {/* <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="20" height="20" viewBox="0 0 24 24" fill="#FFA500" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    ))}
                  </div>
                  <span className="text-white font-semibold">4.9</span>
                  <span className="text-gray-400 text-sm">(124 Reviews)</span>
                </div> */}

                {/* Booking Form */}
                <div className="bg-[#17181b] rounded-xl p-6 border border-gray-700">
                  <h3 className="text-white text-xl font-semibold font-['Space_Grotesk'] mb-4">
                    Schedule Your Service
                  </h3>

                  {/* Form Fields */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Location - Searchable Dropdown */}
                    <div className="relative location-dropdown-container">
                      <label className="text-gray-400 text-sm  mb-2 block">
                        Location
                      </label>
                      
                      {/* Search Input */}
                      <div className="relative">
                        <input
                          type="text"
                          value={isCustomLocation ? location : locationSearch || location}
                          onChange={(e) => {
                            setLocationSearch(e.target.value);
                            setShowLocationDropdown(true);
                            setIsCustomLocation(false);
                          }}
                          onFocus={() => setShowLocationDropdown(true)}
                          placeholder="Search or type your locality..."
                          className="w-full bg-[#0f0f0f] text-white border border-gray-600 rounded-lg px-4 py-3 pr-10  focus:outline-none focus:border-blue-500 transition-colors"
                        />
                        {/* Search Icon */}
                        <div className="absolute right-3 top-1/2 flex -translate-y-1/2 items-center gap-2 text-gray-400">
                          <span aria-hidden="true"></span>
                          <svg
                            width="14"
                            height="8"
                            viewBox="0 0 14 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="text-gray-400"
                            aria-hidden="true"
                          >
                            <path
                              d="M12.5 1.5L7 6.5L1.5 1.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>

                      {/* Dropdown List */}
                      {showLocationDropdown && (
                        <div className="absolute z-50 w-full mt-2 bg-[#17181b] border border-gray-600 rounded-lg max-h-60 overflow-y-auto shadow-xl">
                          {/* Custom Location Option */}
                          {locationSearch && !filteredLocalities.includes(locationSearch) && (
                            <div
                              onClick={() => {
                                setLocation(locationSearch);
                                setIsCustomLocation(true);
                                setShowLocationDropdown(false);
                              }}
                              className="px-4 py-3 text-white hover:bg-blue-600 cursor-pointer border-b border-gray-700 flex items-center gap-2"
                            >
                              <span className="text-emerald-400">✓</span>
                              <span>Use "<strong>{locationSearch}</strong>" (Custom)</span>
                            </div>
                          )}

                          {/* Filtered Localities */}
                          {filteredLocalities.length > 0 ? (
                            filteredLocalities.map((locality, index) => (
                              <div
                                key={index}
                                onClick={() => {
                                  setLocation(locality);
                                  setLocationSearch("");
                                  setIsCustomLocation(false);
                                  setShowLocationDropdown(false);
                                }}
                                className={`px-4 py-3 text-white hover:bg-blue-600 cursor-pointer transition-colors ${
                                  location === locality ? 'bg-blue-700' : ''
                                }`}
                              >
                                {locality}
                              </div>
                            ))
                          ) : (
                            <div className="px-4 py-3 text-gray-400 text-center">
                              No localities found. Type to add custom location.
                            </div>
                          )}

                          {/* Close Button */}
                          <div
                            onClick={() => setShowLocationDropdown(false)}
                            className="sticky bottom-0 px-4 py-2 bg-gray-800 text-center text-gray-400 hover:text-white cursor-pointer border-t border-gray-700 text-sm"
                          >
                            Close
                          </div>
                        </div>
                      )}

                      {/* Selected Location Display */}
                      {location && !showLocationDropdown && (
                        <div className="mt-2 text-sm text-emerald-400 flex items-center gap-2">
                          <span>✓</span>
                          <span>Selected: <strong>{location}</strong></span>
                          {isCustomLocation && <span className="text-xs text-gray-400">(Custom)</span>}
                        </div>
                      )}
                    </div>

                    {/* Sub-Type */}
                    <div className="relative">
                      <label className="text-gray-400 text-sm  mb-2 block">
                        Service Type
                      </label>
                      <select
                        value={subType}
                        onChange={(e) => setSubType(e.target.value)}
                        className="w-full bg-[#0f0f0f] text-white border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                      >
                        <option value="">Select your Sub-Type</option>
                        <option value="Standard">Standard Service</option>
                        <option value="Premium">Premium Service</option>
                        <option value="Emergency">Emergency Service</option>
                      </select>
                      <div className="pointer-events-none absolute right-4 top-[54px] flex items-center text-gray-400">
                        <svg
                          width="14"
                          height="8"
                          viewBox="0 0 14 8"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          aria-hidden="true"
                        >
                          <path
                            d="M12.5 1.5L7 6.5L1.5 1.5"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </div>

                    {/* Date */}
                    <div>
                      <label className="text-gray-400 text-sm  mb-2 block">
                        Preferred Date <span className="text-gray-500 text-xs">(DD-MM-YYYY)</span>
                      </label>
                      <div className="relative">
                        <input
                          type="date"
                          value={date}
                          onChange={(e) => setDate(e.target.value)}
                          placeholder="DD-MM-YYYY"
                          ref={dateInputRef}
                          className="w-full bg-[#0f0f0f] text-white border border-gray-600 rounded-lg px-4 py-3 pr-12 focus:outline-none focus:border-blue-500 transition-colors uppercase appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-webkit-calendar-picker-indicator]:absolute"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const input = dateInputRef.current;
                            if (input) {
                              input.focus();
                              if ("showPicker" in input && typeof input.showPicker === "function") {
                                (input as HTMLInputElement & { showPicker: () => void }).showPicker();
                              }
                            }
                          }}
                          className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg border border-gray-600 bg-[#101820] text-gray-300 transition hover:border-blue-500 hover:text-white"
                          aria-label="Open date picker"
                        >
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M7 3V6M17 3V6M4.5 9H19.5M6 5.5H18C19.1046 5.5 20 6.39543 20 7.5V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V7.5C4 6.39543 4.89543 5.5 6 5.5Z"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <rect x="7.75" y="11.75" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
                            <rect x="13.75" y="11.75" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
                            <rect x="10.75" y="15.75" width="2.5" height="2.5" rx="0.5" fill="currentColor" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Time Slot */}
                    <div>
                      <label className="text-gray-400 text-sm  mb-2 block">
                        Time Slot
                      </label>
                      <div className="relative">
                        <select
                          value={timeSlot}
                          onChange={(e) => setTimeSlot(e.target.value)}
                          className="w-full bg-[#0f0f0f] text-white border border-gray-600 rounded-lg px-4 pr-12 py-3 focus:outline-none focus:border-blue-500 transition-colors appearance-none"
                        >
                          <option value="">Select your Time Slot</option>
                          <option value="8:00 AM - 10:00 AM">8:00 AM - 10:00 AM</option>
                          <option value="10:00 AM - 12:00 PM">10:00 AM - 12:00 PM</option>
                          <option value="12:00 PM - 2:00 PM">12:00 PM - 2:00 PM</option>
                          <option value="2:00 PM - 4:00 PM">2:00 PM - 4:00 PM</option>
                          <option value="4:00 PM - 6:00 PM">4:00 PM - 6:00 PM</option>
                          <option value="6:00 PM - 8:00 PM">6:00 PM - 8:00 PM</option>
                        </select>
                        <div className="pointer-events-none absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg  text-gray-300">
                          <svg
                            width="18"
                            height="18"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            aria-hidden="true"
                          >
                            <path
                              d="M6 9L12 15L18 9"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Add to Cart */}
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 md:gap-6 pt-4 border-t border-gray-700">
                    <div className="text-center md:text-left w-full md:w-auto md:flex-1">
                      <p className="text-gray-400 text-xs sm:text-sm mb-1">Starting from</p>
                      <p className="text-white text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold font-['Space_Grotesk']">
                        {formatPrice(service.normal_price)}
                      </p>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full md:w-auto md:shrink-0">
                      <button
                        onClick={handleCartToggle}
                        disabled={cartButtonDisabled}
                        className="bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:opacity-60 disabled:cursor-not-allowed text-white px-6 py-3 sm:px-8 md:px-8 sm:py-3 rounded-lg font-semibold text-sm sm:text-base font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto md:w-auto"
                      >
                        {cartButtonLabel}
                      </button>
                      {isServiceInCart && (
                        <button
                          onClick={() => (window.location.href = "/cart")}
                          className="px-6 py-3 sm:px-8 md:px-4 border border-white/30 text-white rounded-lg font-['Space_Grotesk'] hover:bg-white/10 transition w-full sm:w-auto md:w-auto text-sm sm:text-base"
                        >
                          Go to Cart
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Description Section */}
            {/* <div className="mb-16">
              <h2 className="text-white text-3xl font-bold font-['Space_Grotesk'] mb-8">
                Description
              </h2>

              <div className="flex flex-col bordgap-8">
                <div className="bg-[#17181b] rounded-xl p-8 border border-gray-700">
                  <h3 className="text-emerald-400 text-xl font-bold font-['Space_Grotesk'] mb-4 flex items-center gap-2">
                    <span className="text-2xl">✓</span> WHY US?
                  </h3>
                  <p className="text-gray-300  leading-relaxed">
                    With years of experience in Dubai's maintenance sector, we deliver exceptional {service.name.toLowerCase()} services. Our professional team ensures quality work, timely service, and customer satisfaction. We use advanced techniques and high-quality materials to guarantee lasting results.
                  </p>
                </div>

                <div className="bg-[#17181b] rounded-xl p-8 border border-gray-700">
                  <h3 className="text-blue-400 text-xl font-bold font-['Space_Grotesk'] mb-4 flex items-center gap-2">
                    <span className="text-2xl">⚙</span> WHAT WE DO?
                  </h3>
                  <ul className="space-y-3 text-gray-300 ">
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>Comprehensive inspection and assessment</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>Professional {service.name.toLowerCase()}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>Quality assurance and testing</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-emerald-400 mt-1">•</span>
                      <span>Post-service cleanup and maintenance tips</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div> */}

            <div data-layer="Frame 48098727" className="Frame48098727 w-full flex flex-col items-start gap-6 px-4 sm:px-6 lg:px-0">
              <div data-layer="Heading" className="Heading w-full text-left text-white text-3xl sm:text-4xl font-medium capitalize leading-tight">
                Description
              </div>

              <div
                data-layer="Frame 48098726"
                className="Frame48098726 w-full bg-linear-to-r from-sky-950/75 to-sky-700/75 rounded-xl flex flex-col gap-6 p-6 sm:p-8"
              >
                <div className="space-y-4 text-white text-base sm:text-lg leading-relaxed">
                  <h3 className="text-lg sm:text-xl font-semibold uppercase tracking-wide">Why Us?</h3>
                  <p>
                    Facades are one of the many things that give your villa an identity. With more than thousands of villas
                    and buildings in every vicinity equipped with these facades, it gives an innovative look for your villa.
                  </p>
                </div>
                    
                <div className="space-y-4 text-white text-base sm:text-lg leading-relaxed">
                  <h3 className="text-lg sm:text-xl font-semibold uppercase tracking-wide">What We Do?</h3>
                  <ul className="space-y-2 list-disc pl-5 text-sm sm:text-base text-white/90">
                    <li>External facade washing</li>
                    <li>Cleaning smudges, spots, and dust</li>
                    <li>Removal of debris and insect marks on the walls</li>
                  </ul>
                </div>
                </div>
                </div>
                {/* Transformation We Offer Section */}
                <div className="mb-16">
                {/* <h2 className="text-white text-3xl font-bold font-['Space_Grotesk'] my-8">
                    Transformation We Offer
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[1, 2, 3].map((item) => (
                    <div key={item} className="bg-[#17181b] rounded-xl overflow-hidden border border-gray-700 hover:border-blue-500 transition-all duration-300">
                        <div className="grid grid-cols-2">
                        <div className="relative">
                            <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            Before
                            </div>
                            <div className="aspect-square bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-600 text-4xl">📷</span>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full z-10">
                            After
                            </div>
                            <div className="aspect-square bg-gray-800 flex items-center justify-center">
                            <span className="text-gray-600 text-4xl">✨</span>
                            </div>
                        </div>
                        </div>
                        <div className="p-4">
                        <p className="text-gray-400 text-sm  text-center">
                            Professional {service.name.toLowerCase()} results
                        </p>
                        </div>
                    </div>
                    ))}
                </div> */}
                </div>

            {/* Reviews Section */}
            <div className="mb-16">
              <h2 className="text-white text-3xl font-bold font-['Space_Grotesk'] mb-8">
                Customer Reviews
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Review 1 */}
                <div className="bg-[#17181b] rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#FFA500" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    ))}
                  </div>
                  <h4 className="text-white font-semibold font-['Space_Grotesk'] mb-2">
                    Excellent Customer Service
                  </h4>
                  <p className="text-gray-400 text-sm  mb-4">
                    The technician was very professional and knowledgeable. He explained everything clearly and completed the job efficiently. Highly recommended!
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                      DL
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">David Lee</p>
                      <p className="text-gray-400 text-xs">Homeowner</p>
                    </div>
                  </div>
                </div>

                {/* Review 2 */}
                <div className="bg-[#17181b] rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#FFA500" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    ))}
                  </div>
                  <h4 className="text-white font-semibold font-['Space_Grotesk'] mb-2">
                    Efficient and Thorough Work
                  </h4>
                  <p className="text-gray-400 text-sm  mb-4">
                    Very impressed with the quality of work. The team was punctual, efficient, and left everything spotless. Great value for money!
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                      SM
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Sarah Martinez</p>
                      <p className="text-gray-400 text-xs">Villa Owner</p>
                    </div>
                  </div>
                </div>

                {/* Review 3 */}
                <div className="bg-[#17181b] rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300">
                  <div className="flex items-center gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg key={star} width="16" height="16" viewBox="0 0 24 24" fill="#FFA500" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                      </svg>
                    ))}
                  </div>
                  <h4 className="text-white font-semibold font-['Space_Grotesk'] mb-2">
                    Professional & Reliable
                  </h4>
                  <p className="text-gray-400 text-sm  mb-4">
                    Outstanding service from start to finish. The booking was easy, and the technicians arrived on time. Will definitely use again!
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="size-10 bg-gray-700 rounded-full flex items-center justify-center text-white font-bold">
                      AK
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">Ahmed Khan</p>
                      <p className="text-gray-400 text-xs">Apartment Resident</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Related Services */}
            {/* <div>
              <h2 className="text-white text-3xl font-bold font-['Space_Grotesk'] mb-8">
                Related Services
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {serviceData
                  .find(cat => cat.category === category)
                  ?.services.filter(s => s.name !== service.name)
                  .slice(0, 4)
                  .map((relatedService, index) => {
                    const RelatedIcon = Icons[relatedService.icon as keyof typeof Icons];
                    return (
                      <div
                        key={index}
                        onClick={() => router.push(`/services/${require('@/app/utils/slugify').slugify(relatedService.name)}`)}
                        className="bg-[#17181b] rounded-xl p-6 border border-gray-700 hover:border-blue-500 transition-all duration-300 cursor-pointer hover:scale-105"
                      >
                        <div className="size-16 flex items-center justify-center bg-white/10 rounded-xl mb-4">
                          {RelatedIcon && <RelatedIcon width={40} height={40} />}
                        </div>
                        <h3 className="text-white font-semibold font-['Space_Grotesk'] mb-2 line-clamp-2">
                          {relatedService.name}
                        </h3>
                        <p className="text-emerald-400 font-bold">
                          {formatPrice(relatedService.member_price)}
                        </p>
                      </div>
                    );
                  })}
              </div>
            </div> */}

          </div>
        </div>

        {/* Booking Confirmation Modal */}
        {showBookingModal && bookingDetails && (
          <div 
            className="fixed inset-0 bg-black/70 backdrop-blur-lg z-100 flex items-center justify-center p-4 animate-fadeIn"
            onClick={() => setShowBookingModal(false)}
          >
            <div 
              className="relative bg-linear-to-br from-slate-900/80 to-black/90 backdrop-blur-2xl border border-blue-500/30 rounded-2xl p-8 max-w-md w-full shadow-2xl shadow-blue-500/20 animate-slideUp"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="size-20 rounded-full bg-linear-to-br from-blue-500 to-cyan-600 flex items-center justify-center animate-bounce shadow-lg shadow-blue-500/50">
                  <svg className="size-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>

              {/* Title */}
              <h2 className="text-center text-white text-3xl font-bold font-['Space_Grotesk'] mb-2">
                Booking Done! 
              </h2>
              <p className="text-center text-white/70 text-sm  mb-6">
                Your service has been successfully booked
              </p>

              {/* Booking Details */}
              <div className="bg-black/40 backdrop-blur-sm border border-blue-500/20 rounded-xl p-5 mb-6 space-y-3">
                <h3 className="text-white font-semibold font-['Space_Grotesk'] text-lg mb-3 border-b border-blue-500/20 pb-2">
                  Booking Details
                </h3>

                {/* Booking ID */}
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm ">Booking ID:</span>
                  <span className="text-cyan-400 text-sm font-bold font-['Space_Grotesk']">
                    {bookingDetails.bookingId}
                  </span>
                </div>

                {/* Service */}
                <div className="flex justify-between items-start">
                  <span className="text-white/60 text-sm ">Service:</span>
                  <span className="text-white text-sm font-medium font-['Space_Grotesk'] text-right max-w-[200px]">
                    {bookingDetails.service}
                  </span>
                </div>

                {/* Category */}
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm ">Category:</span>
                  <span className="text-white text-sm font-medium font-['Space_Grotesk']">
                    {bookingDetails.category}
                  </span>
                </div>

                {/* Location */}
                <div className="flex justify-between items-start">
                  <span className="text-white/60 text-sm ">Location:</span>
                  <span className="text-white text-sm font-medium font-['Space_Grotesk'] text-right max-w-[200px]">
                    {bookingDetails.location}
                  </span>
                </div>

                {/* Service Type */}
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm ">Service Type:</span>
                  <span className="text-white text-sm font-medium font-['Space_Grotesk']">
                    {bookingDetails.serviceType}
                  </span>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm ">Date:</span>
                  <span className="text-white text-sm font-medium font-['Space_Grotesk']">
                    {new Date(bookingDetails.date).toLocaleDateString('en-GB')}
                  </span>
                </div>

                {/* Time Slot */}
                <div className="flex justify-between items-center">
                  <span className="text-white/60 text-sm ">Time Slot:</span>
                  <span className="text-white text-sm font-medium font-['Space_Grotesk']">
                    {bookingDetails.timeSlot}
                  </span>
                </div>

                {/* Price */}
                <div className="flex justify-between items-center pt-3 border-t border-blue-500/30">
                  <span className="text-white/60 text-base ">Total Price:</span>
                  <span className="text-cyan-400 text-xl font-bold font-['Space_Grotesk']">
                    {formatPrice(bookingDetails.price)}
                  </span>
                </div>
              </div>

              {/* Info Message */}
              {/* <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3 mb-6">
                <p className="text-blue-300 text-xs  text-center">
                  📧 A confirmation email has been sent to your registered email address
                </p>
              </div> */}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowBookingModal(false);
                    router.push('/');
                  }}
                  className="flex-1 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold font-['Space_Grotesk'] rounded-lg transition-all duration-300"
                >
                  Go Home
                </button>
                <button
                  onClick={() => setShowBookingModal(false)}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white font-semibold font-['Space_Grotesk'] rounded-lg transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/50"
                >
                  Done
                </button>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}

        <style jsx>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes slideUp {
            from { 
              opacity: 0;
              transform: translateY(20px);
            }
            to { 
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
          .animate-slideUp {
            animation: slideUp 0.4s ease-out;
          }
        `}</style>

        <Footer />
      </div>
    </div>
  );
};

export default ServiceDetailPage;

