'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { fetchWithCache } from "@/app/utils/cache";

type BookingUser = {
  id: string;
  email: string | null;
  fullName: string | null;
};

type BookingService = {
  id: string;
  name: string;
  normal_price: string;
  member_price: string;
  icon: string;
};

type BookingCartItem = {
  id: string;
  category_name: string | null;
  location: string | null;
  service_type: string | null;
  scheduled_date: string | null;
  time_slot: string | null;
  price: string | null;
  services?: BookingService | null;
};

type Booking = {
  id: string;
  scheduled_date: string | null;
  status: string;
  service_type: string | null;
  location: string | null;
  user: BookingUser | null;
  bookingCartItems: BookingCartItem[];
};

type BookingsResponse = {
  message: string;
  bookings: Booking[];
  pagination: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
};

type BookingsCalendarProps = {
  isAuthorized: boolean;
};

const BookingsCalendar = ({ isAuthorized }: BookingsCalendarProps) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarBookings, setCalendarBookings] = useState<Booking[]>([]);
  const [loadingCalendar, setLoadingCalendar] = useState(false);

  const fetchCalendarBookings = useCallback(async (startDate: Date, endDate: Date) => {
    if (!isAuthorized) return;
    
    setLoadingCalendar(true);
    try {
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      const cacheKey = `admin-calendar-bookings-${startDateStr}-${endDateStr}`;

      const body = await fetchWithCache<BookingsResponse>(
        cacheKey,
        async () => {
          const response = await fetch(
            `/api/bookings?startDate=${startDateStr}&endDate=${endDateStr}&pageSize=1000`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch calendar bookings");
          }

          return (await response.json()) as BookingsResponse;
        },
        {
          ttl: 15 * 1000, // 15 seconds cache for calendar
          useStaleWhileRevalidate: true,
        }
      );

      setCalendarBookings(body.bookings ?? []);
    } catch (err) {
      console.error("Failed to load calendar bookings:", err);
    } finally {
      setLoadingCalendar(false);
    }
  }, [isAuthorized]);

  const dateTabs = useMemo(() => {
    const dates: Date[] = [];
    const startDate = new Date(selectedDate);
    startDate.setDate(startDate.getDate() - 3); // Show 3 days before and after selected date (7 days total)

    for (let i = 0; i < 7; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      dates.push(date);
    }

    return dates;
  }, [selectedDate]);

  useEffect(() => {
    if (isAuthorized) {
      const startDate = new Date(dateTabs[0]);
      const endDate = new Date(dateTabs[dateTabs.length - 1]);
      endDate.setDate(endDate.getDate() + 1);
      fetchCalendarBookings(startDate, endDate);
    }
  }, [dateTabs, isAuthorized, fetchCalendarBookings]);

  const navigateDates = (direction: 'prev' | 'next') => {
    setSelectedDate((prev) => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setDate(prev.getDate() - 7);
      } else {
        newDate.setDate(prev.getDate() + 7);
      }
      return newDate;
    });
  };

  const goToToday = () => {
    setSelectedDate(new Date());
  };

  const selectedDateBookings = useMemo(() => {
    const selectedDateStr = selectedDate.toISOString().split('T')[0];
    return calendarBookings.filter((booking) => {
      // Check booking-level scheduled_date
      if (booking.scheduled_date?.startsWith(selectedDateStr)) {
        return true;
      }
      // Check cart items for scheduled_date
      return booking.bookingCartItems.some(
        (item) => item.scheduled_date?.startsWith(selectedDateStr)
      );
    });
  }, [selectedDate, calendarBookings]);

  const formatTime = (dateStr: string | null) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  const getUserDisplayName = (booking: Booking) => {
    if (booking.user?.fullName && booking.user.fullName.trim().length > 0) {
      return booking.user.fullName;
    }
    if (booking.user?.email) {
      return booking.user.email;
    }
    if (booking.bookingCartItems.length > 0) {
      const firstItem = booking.bookingCartItems[0];
      return firstItem.location ?? "Anonymous";
    }
    return "Anonymous";
  };

  const monthYearLabel = selectedDate.toLocaleDateString("en-GB", {
    month: "long",
    year: "numeric",
  });

  const selectedDateLabel = selectedDate.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-lg h-full">
      {/* Header with Month/Year */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Bookings</h2>
          <p className="mt-1 text-sm sm:text-base font-medium text-sky-400 capitalize">
            {monthYearLabel}
          </p>
        </div>
        <button
          type="button"
          onClick={goToToday}
          className="self-start sm:self-auto rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs font-semibold text-slate-300 transition hover:border-sky-500 hover:text-sky-300"
        >
          Today
        </button>
      </div>

      {/* Selected Date Info */}
      <div className="mb-4 sm:mb-6 px-2">
        <p className="text-xs sm:text-sm text-slate-400">
          Selected: <span className="font-medium text-slate-300 capitalize">{selectedDateLabel}</span>
        </p>
      </div>

      {/* Date Navigation Tabs */}
      <div className="mb-4 sm:mb-6 flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
        <button
          type="button"
          onClick={() => navigateDates('prev')}
          disabled={loadingCalendar}
          className="flex shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-1.5 sm:p-2 text-slate-300 transition hover:border-sky-500 hover:text-sky-300 disabled:opacity-50"
          aria-label="Previous week"
        >
          <ChevronLeftIcon className="size-4 sm:size-5" />
        </button>

        <div className="flex flex-1 gap-1.5 sm:gap-2 overflow-x-auto min-w-0">
          {dateTabs.map((date) => {
            const isSelected = date.toDateString() === selectedDate.toDateString();
            const isToday = date.toDateString() === new Date().toDateString();
            const dateStr = date.toISOString().split('T')[0];
            const dayBookings = calendarBookings.filter((booking) => {
              if (booking.scheduled_date?.startsWith(dateStr)) {
                return true;
              }
              return booking.bookingCartItems.some(
                (item) => item.scheduled_date?.startsWith(dateStr)
              );
            });
            const bookingCount = dayBookings.reduce(
              (sum, booking) => sum + booking.bookingCartItems.length,
              0
            );

            return (
              <button
                key={date.toISOString()}
                type="button"
                onClick={() => setSelectedDate(date)}
                className={`shrink-0 rounded-lg border px-2.5 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition min-w-14 sm:min-w-16 ${
                  isSelected
                    ? "border-sky-500 bg-sky-500/20 text-white shadow-lg shadow-sky-500/20"
                    : isToday
                    ? "border-sky-400/50 bg-slate-900/80 text-slate-200"
                    : "border-slate-700 bg-slate-900/60 text-slate-300 hover:border-slate-600"
                }`}
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span className={`text-[10px] sm:text-xs ${
                    isSelected ? "text-sky-300" : "text-slate-400"
                  }`}>
                    {date.toLocaleDateString("en-GB", { weekday: "short" })}
                  </span>
                  <span className={`text-sm sm:text-base ${
                    isToday && !isSelected ? "text-sky-400" : ""
                  }`}>
                    {date.getDate()}
                  </span>
                  {bookingCount > 0 && (
                    <span className={`text-[10px] sm:text-xs font-semibold ${
                      isSelected ? "text-sky-300" : "text-sky-400"
                    }`}>
                      {bookingCount}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => navigateDates('next')}
          disabled={loadingCalendar}
          className="flex shrink-0 items-center justify-center rounded-lg border border-slate-700 bg-slate-900 p-1.5 sm:p-2 text-slate-300 transition hover:border-sky-500 hover:text-sky-300 disabled:opacity-50"
          aria-label="Next week"
        >
          <ChevronRightIcon className="size-4 sm:size-5" />
        </button>
      </div>

      {/* Bookings List */}
      <div className="space-y-0 divide-y divide-slate-800/50 rounded-lg border border-slate-800 bg-slate-950/40">
        {loadingCalendar ? (
          Array.from({ length: 5 }).map((_, index) => (
            <div key={`skeleton-${index}`} className="animate-pulse p-3 sm:p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="space-y-2 flex-1">
                  <div className="h-4 w-32 sm:w-40 rounded bg-slate-800/60" />
                  <div className="h-3 w-48 sm:w-56 rounded bg-slate-800/60" />
                </div>
                <div className="h-4 w-16 sm:w-20 rounded bg-slate-800/60 self-start sm:self-auto" />
              </div>
            </div>
          ))
        ) : selectedDateBookings.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-sm">No bookings scheduled for this date</p>
          </div>
        ) : (
          selectedDateBookings.flatMap((booking) => {
            const selectedDateStr = selectedDate.toISOString().split('T')[0];
            
            // If booking has cart items, filter and map them
            if (booking.bookingCartItems.length > 0) {
              return booking.bookingCartItems
                .filter((item) => {
                  const itemDate = item.scheduled_date ?? booking.scheduled_date;
                  return itemDate?.startsWith(selectedDateStr);
                })
                .map((item, itemIndex) => {
                  const serviceName = item.services?.name ?? item.service_type ?? booking.service_type ?? "Service";
                  const clientName = getUserDisplayName(booking);
                  const location = item.location ?? booking.location ?? "";
                  const time = formatTime(item.scheduled_date ?? booking.scheduled_date);

                  return (
                    <div
                      key={`${booking.id}-${item.id}-${itemIndex}`}
                      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 transition hover:bg-slate-900/40"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm sm:text-base text-white truncate">{serviceName}</p>
                        <p className="mt-1 text-xs sm:text-sm text-slate-400 line-clamp-2">
                          {clientName}
                          {location && `, ${location}`}
                          {location && !location.includes("UAE") && ", UAE"}
                        </p>
                      </div>
                      <div className="sm:ml-4 sm:text-right shrink-0">
                        <p className="text-xs sm:text-sm font-medium text-white">{time}</p>
                      </div>
                    </div>
                  );
                });
            }
            
            // If booking has no cart items but has scheduled_date, show the booking itself
            if (booking.scheduled_date?.startsWith(selectedDateStr)) {
              const serviceName = booking.service_type ?? "Service";
              const clientName = getUserDisplayName(booking);
              const location = booking.location ?? "";
              const time = formatTime(booking.scheduled_date);

              return [
                <div
                  key={booking.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 sm:p-4 transition hover:bg-slate-900/40"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm sm:text-base text-white truncate">{serviceName}</p>
                    <p className="mt-1 text-xs sm:text-sm text-slate-400 line-clamp-2">
                      {clientName}
                      {location && `, ${location}`}
                      {location && !location.includes("UAE") && ", UAE"}
                    </p>
                  </div>
                  <div className="sm:ml-4 sm:text-right shrink-0">
                    <p className="text-xs sm:text-sm font-medium text-white">{time}</p>
                  </div>
                </div>
              ];
            }
            
            return [];
          })
        )}
      </div>
    </section>
  );
};

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 15L7 10L12 5"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M8 5L13 10L8 15"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BookingsCalendar;

