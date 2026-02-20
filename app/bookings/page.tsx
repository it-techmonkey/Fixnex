"use client";

import { useEffect, useState } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import Icons from "@/app/components/icons";

type SessionState = {
  loading: boolean;
  isAuthenticated: boolean;
  userId?: string;
};

type BookingService = {
  id: string;
  name: string;
  normal_price: string;
  member_price: string;
  icon: string;
};

type BookingCartItemRecord = {
  id: string;
  services: BookingService | null;
  category_name?: string | null;
  location?: string | null;
  service_type?: string | null;
  scheduled_date?: string | null;
  time_slot?: string | null;
  price?: string | null;
};

type BookingRecord = {
  id: string;
  bookingCartItems: BookingCartItemRecord[];
  scheduled_date: string | null;
  time_slot: string | null;
  created_at: string;
  price: string | null;
};

type BookingTab = "upcoming" | "past";

const BookingsPage = () => {
  const [session, setSession] = useState<SessionState>({
    loading: true,
    isAuthenticated: false,
    userId: undefined,
  });
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [activeTab, setActiveTab] = useState<BookingTab>("upcoming");
  const [actioningBookingId, setActioningBookingId] = useState<string | null>(null);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [savingItemId, setSavingItemId] = useState<string | null>(null);
  const [editItemForm, setEditItemForm] = useState({
    scheduledDate: "",
    timeSlot: "",
    location: "",
    serviceType: "",
    categoryName: "",
    price: "",
  });

  const formatDate = (value?: string | null) => {
    if (!value) {
      return null;
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
      weekday: "short",
      day: "2-digit",
      month: "short",
      year: "numeric",
    }).format(date);
  };

  const formatDateForInput = (value?: string | null) => {
    if (!value) {
      return "";
    }
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().slice(0, 10);
  };

  const handleEditItemFormChange = (field: keyof typeof editItemForm, value: string) => {
    setEditItemForm((prev) => ({
      ...prev,
      [field]: value,
    }));
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

    const loadBookings = async () => {
      if (!session.isAuthenticated || !session.userId) {
        setBookings([]);
        setLoadingBookings(false);
        return;
      }

      try {
        setLoadingBookings(true);
        const response = await fetch(`/api/bookings/user/${session.userId}`, {
          method: "GET",
          credentials: "include",
        });
        if (cancelled) return;

        if (response.ok) {
          const data = await response.json();
          const bookingRecords: BookingRecord[] = data?.bookings ?? [];
          setBookings(bookingRecords);
        } else {
          setBookings([]);
        }
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
        if (!cancelled) {
          setBookings([]);
        }
      } finally {
        if (!cancelled) {
          setLoadingBookings(false);
        }
      }
    };

    if (!session.loading) {
      loadBookings();
    }

    return () => {
      cancelled = true;
    };
  }, [session.loading, session.isAuthenticated, session.userId]);

  const upcomingBookings = bookings.filter((booking) => {
    if (!booking.scheduled_date) {
      return true;
    }
    const scheduledDate = new Date(booking.scheduled_date);
    return scheduledDate >= new Date();
  });

  const pastBookings = bookings.filter((booking) => {
    if (!booking.scheduled_date) {
      return false;
    }
    const scheduledDate = new Date(booking.scheduled_date);
    return scheduledDate < new Date();
  });

  const handleDeleteBooking = async (bookingId: string) => {
    const confirmed = window.confirm("Are you sure you want to delete this booking?");
    if (!confirmed) {
      return;
    }

    try {
      setActioningBookingId(bookingId);
      const response = await fetch(`/api/bookings/${bookingId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.message ?? "Failed to delete booking.");
      }

      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert("We couldn't delete this booking. Please try again.");
    } finally {
      setActioningBookingId(null);
    }
  };

  const startEditingItem = (booking: BookingRecord, item: BookingCartItemRecord) => {
    setEditingItemId(item.id);
    setEditItemForm({
      scheduledDate: formatDateForInput(item.scheduled_date ?? booking.scheduled_date),
      timeSlot: item.time_slot ?? booking.time_slot ?? "",
      location: item.location ?? "",
      serviceType: item.service_type ?? "",
      categoryName: item.category_name ?? "",
      price: item.price ?? booking.price ?? "",
    });
  };

  const cancelEditingItem = () => {
    setEditingItemId(null);
    setSavingItemId(null);
    setEditItemForm({
      scheduledDate: "",
      timeSlot: "",
      location: "",
      serviceType: "",
      categoryName: "",
      price: "",
    });
  };

  const submitEditItem = async (booking: BookingRecord, item: BookingCartItemRecord) => {
    let scheduledISO: string | null = null;
    const trimmedDate = editItemForm.scheduledDate.trim();
    if (trimmedDate) {
      const parsed = new Date(trimmedDate);
      if (Number.isNaN(parsed.getTime())) {
        alert("Please provide a valid date in YYYY-MM-DD format.");
        return;
      }
      scheduledISO = parsed.toISOString();
    }

    const payload: Record<string, unknown> = {
      scheduledDate: scheduledISO,
      timeSlot: editItemForm.timeSlot.trim() || null,
      location: editItemForm.location.trim() || null,
      serviceType: editItemForm.serviceType.trim() || null,
      categoryName: editItemForm.categoryName.trim() || null,
      price: editItemForm.price.trim() || null,
    };

    try {
      setSavingItemId(item.id);
      const response = await fetch(`/api/booking-cart-items/${item.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message ?? "Failed to update booking cart item.");
      }

      const data = (await response.json()) as { item?: BookingCartItemRecord & { booking?: { id: string } } };
      const updatedItem = data?.item;
      if (updatedItem) {
        const updatedBookingId = updatedItem.booking?.id ?? booking.id;
        setBookings((prev) =>
          prev.map((record) => {
            if (record.id !== updatedBookingId) {
              return record;
            }

            return {
              ...record,
              bookingCartItems: record.bookingCartItems.map((cartItem) =>
                cartItem.id === updatedItem.id
                  ? {
                      ...cartItem,
                      category_name: updatedItem.category_name,
                      location: updatedItem.location,
                      service_type: updatedItem.service_type,
                      scheduled_date: updatedItem.scheduled_date,
                      time_slot: updatedItem.time_slot,
                      price: updatedItem.price,
                    }
                  : cartItem
              ),
            };
          })
        );
      }
      cancelEditingItem();
    } catch (error) {
      console.error("Failed to update booking cart item:", error);
      alert(
        error instanceof Error ? error.message : "We couldn't update this booking cart item. Please try again."
      );
    } finally {
      setSavingItemId(null);
    }
  };

  const renderBookingCard = (booking: BookingRecord) => {
    const isDeleting = actioningBookingId === booking.id;
    return (
      <div
        key={booking.id}
        className="bg-[#17181b] border border-gray-700 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-4 sm:space-y-6 hover:border-blue-500/60 transition"
      >
        <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center justify-between gap-3 sm:gap-4 text-white/80 text-xs sm:text-sm">
          <span className="font-medium font-['Space_Grotesk'] break-all">Booking ID: {booking.id}</span>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <span className="text-white/70">
              Created:{" "}
              {new Date(booking.created_at).toLocaleString("en-GB", {
                dateStyle: "medium",
                timeStyle: "short",
              })}
            </span>
            <button
              onClick={() => handleDeleteBooking(booking.id)}
              disabled={isDeleting}
              className="px-3 py-1.5 text-sm rounded-md border border-red-500/60 text-red-300 hover:bg-red-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed font-['Space_Grotesk']"
            >
              {isDeleting ? "Deleting…" : "Delete"}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {booking.bookingCartItems.map((item) => {
            const svc = item.services;
            if (!svc) {
              return null;
            }

            const IconComponent = Icons[svc.icon as keyof typeof Icons];
            const isItemEditing = editingItemId === item.id;
            const isSavingItem = savingItemId === item.id;

            return (
              <div
                key={item.id}
                className="flex flex-col gap-3 sm:gap-4 bg-black/30 border border-white/10 rounded-lg sm:rounded-xl p-3 sm:p-4"
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  <div className="size-12 sm:size-16 bg-white/10 rounded-lg sm:rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                    {IconComponent && <IconComponent width={36} height={36} />}
                  </div>
                  <div className="flex-1 min-w-0 space-y-1">
                    <h4 className="text-white text-base sm:text-lg font-semibold font-['Space_Grotesk'] truncate">
                      {svc.name}
                    </h4>
                    <p className="text-white/70 text-xs sm:text-sm">
                      Price:{" "}
                      <span className="text-white font-semibold">
                        {item.price
                          ? isNaN(parseFloat(item.price))
                            ? item.price
                            : `AED ${parseFloat(item.price).toFixed(2)}`
                          : isNaN(parseFloat(svc.normal_price))
                          ? svc.normal_price
                          : `AED ${parseFloat(svc.normal_price).toFixed(2)}`}
                      </span>
                    </p>
                    <p className="text-white/60 text-xs sm:text-sm">
                      Member:{" "}
                      <span className="text-emerald-400 font-semibold">
                        {isNaN(parseFloat(svc.member_price))
                          ? svc.member_price
                          : `AED ${parseFloat(svc.member_price).toFixed(2)}`}
                      </span>
                    </p>
                    {(item.category_name || item.service_type) && (
                      <div className="space-y-1 mt-2">
                        {item.category_name && (
                          <p className="text-white/60 text-xs sm:text-sm">
                            Category:{" "}
                            <span className="text-white font-semibold">{item.category_name}</span>
                          </p>
                        )}
                        {item.service_type && (
                          <p className="text-white/60 text-xs sm:text-sm">
                            Service Type:{" "}
                            <span className="text-white font-semibold">{item.service_type}</span>
                          </p>
                        )}
                      </div>
                    )}
                    {(item.scheduled_date || item.time_slot || item.location) && (
                      <div className="space-y-1 mt-2">
                        {item.scheduled_date && (
                          <p className="text-white/60 text-xs sm:text-sm">
                            Scheduled:{" "}
                            <span className="text-white font-semibold">
                              {formatDate(item.scheduled_date) ?? item.scheduled_date}
                            </span>
                          </p>
                        )}
                        {item.time_slot && (
                          <p className="text-white/60 text-xs sm:text-sm">
                            Time Slot:{" "}
                            <span className="text-white font-semibold">{item.time_slot}</span>
                          </p>
                        )}
                        {item.location && (
                          <p className="text-white/60 text-xs sm:text-sm">
                            Location: <span className="text-white font-semibold">{item.location}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => (isItemEditing ? cancelEditingItem() : startEditingItem(booking, item))}
                    disabled={isSavingItem}
                    className="px-3 py-1.5 text-xs sm:text-sm rounded-md border border-blue-500/60 text-blue-300 hover:bg-blue-500/10 transition disabled:opacity-60 disabled:cursor-not-allowed font-['Space_Grotesk']"
                  >
                    {isItemEditing ? "Cancel" : "Edit Item"}
                  </button>
                </div>

                {isItemEditing && (
                  <div className="bg-black/50 border border-white/10 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <label className="flex flex-col text-white/70 text-xs sm:text-sm space-y-1">
                        <span>Scheduled Date</span>
                        <input
                          type="date"
                          value={editItemForm.scheduledDate}
                          onChange={(event) => handleEditItemFormChange("scheduledDate", event.target.value)}
                          className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="flex flex-col text-white/70 text-xs sm:text-sm space-y-1">
                        <span>Time Slot</span>
                        <input
                          type="text"
                          value={editItemForm.timeSlot}
                          onChange={(event) => handleEditItemFormChange("timeSlot", event.target.value)}
                          placeholder="e.g. 10:00 AM - 12:00 PM"
                          className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="flex flex-col text-white/70 text-xs sm:text-sm space-y-1">
                        <span>Location</span>
                        <input
                          type="text"
                          value={editItemForm.location}
                          onChange={(event) => handleEditItemFormChange("location", event.target.value)}
                          placeholder="Enter location"
                          className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="flex flex-col text-white/70 text-xs sm:text-sm space-y-1">
                        <span>Service Type</span>
                        <input
                          type="text"
                          value={editItemForm.serviceType}
                          onChange={(event) => handleEditItemFormChange("serviceType", event.target.value)}
                          placeholder="e.g. Premium"
                          className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="flex flex-col text-white/70 text-xs sm:text-sm space-y-1">
                        <span>Category</span>
                        <input
                          type="text"
                          value={editItemForm.categoryName}
                          onChange={(event) => handleEditItemFormChange("categoryName", event.target.value)}
                          placeholder="e.g. Cleaning"
                          className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500"
                        />
                      </label>
                      <label className="flex flex-col text-white/70 text-xs sm:text-sm space-y-1">
                        <span>Price</span>
                        <input
                          type="text"
                          value={editItemForm.price}
                          onChange={(event) => handleEditItemFormChange("price", event.target.value)}
                          placeholder="e.g. 250.00"
                          className="bg-black/60 border border-white/10 rounded-lg px-3 py-2 text-sm sm:text-base text-white focus:outline-none focus:border-blue-500"
                        />
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                      <button
                        onClick={() => submitEditItem(booking, item)}
                        disabled={isSavingItem}
                        className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded-lg bg-linear-to-r from-emerald-500 to-green-500 text-white font-semibold font-['Space_Grotesk'] hover:from-emerald-600 hover:to-green-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isSavingItem ? "Saving…" : "Save Changes"}
                      </button>
                      <button
                        onClick={cancelEditingItem}
                        disabled={isSavingItem}
                        className="w-full sm:w-auto px-4 py-2 text-sm sm:text-base rounded-lg border border-white/20 text-white font-semibold font-['Space_Grotesk'] hover:bg-white/10 transition disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        Discard
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="border-t border-gray-700 pt-3 sm:pt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-white/70 text-xs sm:text-sm">
          <div>
            <span className="text-white/50 uppercase tracking-wide text-xs font-['Space_Grotesk']">Estimated Cost</span>
            <div className="text-emerald-400 font-semibold mt-1 text-sm sm:text-base font-['Space_Grotesk']">
              AED {booking.price ?? "Contact us for pricing"}
            </div>
          </div>
          <div>
            <span className="text-white/50 uppercase tracking-wide text-xs font-['Space_Grotesk']">Items</span>
            <div className="text-white font-semibold mt-1 text-sm sm:text-base font-['Space_Grotesk']">{booking.bookingCartItems.length}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    if (session.loading || loadingBookings) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-white space-y-4">
          <div className="size-12 border-4 border-white/20 border-t-white rounded-full animate-spin" />
          <p className="text-white/80 text-lg font-['Space_Grotesk']">Loading your bookings...</p>
        </div>
      );
    }

    if (!session.isAuthenticated) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-white space-y-4 sm:space-y-6 px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk']">You are not signed in</h2>
          <p className="text-white/70 text-sm sm:text-base max-w-lg">
            Log in to view your booking history and track upcoming services.
          </p>
          <button
            onClick={() => (window.location.href = "/login?redirect=/bookings")}
            className="px-6 py-3 text-sm sm:text-base bg-white text-black rounded-lg font-semibold font-['Space_Grotesk'] hover:bg-gray-200 transition"
          >
            Log In
          </button>
        </div>
      );
    }

    const tabBookings = activeTab === "upcoming" ? upcomingBookings : pastBookings;

    if (bookings.length === 0 || tabBookings.length === 0) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center text-center text-white space-y-4 sm:space-y-6 px-4">
          <h2 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk']">
            {activeTab === "upcoming" ? "No upcoming bookings" : "No past bookings"}
          </h2>
          <p className="text-white/70 text-sm sm:text-base max-w-lg">
            {activeTab === "upcoming"
              ? "You don't have any scheduled services right now. Book one today!"
              : "Past bookings will appear here once you have completed services."}
          </p>
          <button
            onClick={() => (window.location.href = "/services")}
            className="px-6 py-3 text-sm sm:text-base bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white rounded-lg font-semibold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
          >
            Browse Services
          </button>
        </div>
      );
    }

    return (
      <div className="space-y-4 sm:space-y-6">
        {tabBookings.map((booking) => renderBookingCard(booking))}
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
              <h1 className="text-white text-2xl sm:text-3xl md:text-4xl font-semibold font-['Space_Grotesk']">Your Bookings</h1>
              <p className="text-white/60 text-sm sm:text-base mt-2">
                Track your scheduled services and review your booking history.
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => setActiveTab("upcoming")}
                className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg font-semibold font-['Space_Grotesk'] transition ${
                  activeTab === "upcoming"
                    ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Current Bookings
              </button>
              <button
                onClick={() => setActiveTab("past")}
                className={`px-3 py-2 sm:px-4 text-sm sm:text-base rounded-lg font-semibold font-['Space_Grotesk'] transition ${
                  activeTab === "past"
                    ? "bg-linear-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/30"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                Past Bookings
              </button>
            </div>

            {renderContent()}
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default BookingsPage;

