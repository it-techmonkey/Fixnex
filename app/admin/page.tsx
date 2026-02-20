'use client';

import { Fragment, Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchWithCache, removeCachedData } from "@/app/utils/cache";

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
  category_name: string | null;
  location: string | null;
  service_type: string | null;
  scheduled_date: string | null;
  time_slot: string | null;
  price: string | null;
  status: string;
  created_at: string;
  user: BookingUser | null;
  bookingCartItems: BookingCartItem[];
};

type PaginationPayload = {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};

type ApiResponse = {
  message: string;
  bookings: Booking[];
  pagination: PaginationPayload;
};

type FiltersState = {
  search: string;
  userName: string;
  location: string;
  serviceType: string;
  categoryName: string;
  status: string;
  date: string;
  startDate: string;
  endDate: string;
  page: number;
  pageSize: number;
};

const bookingStatusStyles: Record<string, string> = {
  PENDING:
    "border border-amber-400/70 bg-amber-500/15 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.15)]",
  CONFIRMED:
    "border border-sky-400/70 bg-sky-500/15 text-sky-100 shadow-[0_0_16px_rgba(56,189,248,0.18)]",
  ONGOING:
    "border border-indigo-400/70 bg-indigo-500/15 text-indigo-100 shadow-[0_0_16px_rgba(99,102,241,0.18)]",
  COMPLETED:
    "border border-emerald-400/70 bg-emerald-500/15 text-emerald-100 shadow-[0_0_16px_rgba(34,197,94,0.2)]",
  CANCELLED:
    "border border-rose-400/70 bg-rose-500/15 text-rose-100 shadow-[0_0_16px_rgba(244,63,94,0.2)]",
  REJECTED:
    "border border-red-400/70 bg-red-500/15 text-red-100 shadow-[0_0_16px_rgba(248,113,113,0.2)]",
};

const bookingStatusOptions = Object.keys(bookingStatusStyles);

const defaultFilters: FiltersState = {
  search: "",
  userName: "",
  location: "",
  serviceType: "",
  categoryName: "",
  status: "",
  date: "",
  startDate: "",
  endDate: "",
  page: 1,
  pageSize: 10,
};

const AdminPageContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<FiltersState>(defaultFilters);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [pagination, setPagination] = useState<PaginationPayload>({
    total: 0,
    page: 1,
    pageSize: defaultFilters.pageSize,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFiltersExpanded, setIsFiltersExpanded] = useState(false);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Initialize filters from URL parameters on mount
  useEffect(() => {
    if (searchParams) {
      const urlFilters: Partial<FiltersState> = {
        search: searchParams.get('search') || '',
        userName: searchParams.get('userName') || '',
        location: searchParams.get('location') || '',
        serviceType: searchParams.get('serviceType') || '',
        categoryName: searchParams.get('categoryName') || '',
        status: searchParams.get('status') || '',
        date: searchParams.get('date') || '',
        startDate: searchParams.get('startDate') || '',
        endDate: searchParams.get('endDate') || '',
        page: Number(searchParams.get('page')) || 1,
        pageSize: Number(searchParams.get('pageSize')) || defaultFilters.pageSize,
      };

      // Only update if there are actual URL parameters
      const hasUrlParams = Object.values(urlFilters).some((value) => {
        if (typeof value === 'string') {
          return value !== '';
        }
        if (typeof value === 'number') {
          return value !== defaultFilters.page && value !== defaultFilters.pageSize;
        }
        return false;
      });

      if (hasUrlParams) {
        setFilters((prev) => ({
          ...prev,
          ...urlFilters,
          page: urlFilters.page || prev.page,
          pageSize: urlFilters.pageSize || prev.pageSize,
        }));
        // Expand filters section when coming from dashboard with filters
        setIsFiltersExpanded(true);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    let isMounted = true;

    const verifyAdminAccess = async () => {
      setCheckingAuth(true);
      setAuthError(null);

      try {
        const response = await fetch("/api/auth/session", {
          method: "GET",
          credentials: "include",
        });

        if (!isMounted) {
          return;
        }

        if (!response.ok) {
          throw new Error("You must be signed in to access this page.");
        }

        const data = await response.json();
        const role = data?.user?.role;

        if (role !== "ADMIN") {
          throw new Error("Only administrators can access this page.");
        }

        setIsAuthorized(true);
      } catch (err) {
        setIsAuthorized(false);
        setAuthError((err as Error).message ?? "Access denied.");
      } finally {
        if (isMounted) {
          setCheckingAuth(false);
        }
      }
    };

    verifyAdminAccess();

    return () => {
      isMounted = false;
    };
  }, []);

  const queryString = useMemo(() => {
    const params = new URLSearchParams();

    params.set("page", filters.page.toString());
    params.set("pageSize", filters.pageSize.toString());

    if (filters.search) {
      params.set("search", filters.search);
    }
    if (filters.userName) {
      params.set("userName", filters.userName);
    }
    if (filters.location) {
      params.set("location", filters.location);
    }
    if (filters.serviceType) {
      params.set("serviceType", filters.serviceType);
    }
    if (filters.categoryName) {
      params.set("categoryName", filters.categoryName);
    }
    if (filters.status) {
      params.set("status", filters.status);
    }

    if (filters.date) {
      params.set("date", filters.date);
    } else {
      if (filters.startDate) {
        params.set("startDate", filters.startDate);
      }
      if (filters.endDate) {
        params.set("endDate", filters.endDate);
      }
    }

    return params.toString();
  }, [filters]);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      // Create cache key based on query string
      const cacheKey = `admin-bookings-${queryString}`;

      const data = await fetchWithCache<ApiResponse>(
        cacheKey,
        async () => {
          const response = await fetch(`/api/bookings?${queryString}`, {
            method: "GET",
            cache: "no-store",
          });

          if (!response.ok) {
            throw new Error(`Failed to fetch bookings (${response.status})`);
          }

          return (await response.json()) as ApiResponse;
        },
        {
          ttl: 10 * 1000, // 10 seconds cache for bookings (shorter than dashboard)
          useStaleWhileRevalidate: true,
        }
      );

      setBookings(data.bookings ?? []);
      setPagination(
        data.pagination ?? {
          total: data.bookings?.length ?? 0,
          page: filters.page,
          pageSize: filters.pageSize,
          totalPages: 1,
        }
      );
    } catch (err) {
      setError((err as Error).message ?? "Something went wrong while fetching bookings.");
    } finally {
      setLoading(false);
    }
  }, [filters.page, filters.pageSize, queryString]);

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }
    fetchBookings();
  }, [fetchBookings, isAuthorized]);

  const handleFilterChange = <K extends keyof FiltersState>(
    key: K,
    value: FiltersState[K],
    resetPage = true
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
      ...(resetPage ? { page: 1 } : {}),
    }));
  };

  const handleDateChange = (key: "date" | "startDate" | "endDate", value: string) => {
    if (key === "date") {
      setFilters((prev) => ({
        ...prev,
        date: value,
        startDate: value ? "" : prev.startDate,
        endDate: value ? "" : prev.endDate,
        page: 1,
      }));
      return;
    }

    setFilters((prev) => ({
      ...prev,
      [key]: value,
      date: value ? "" : prev.date,
      page: 1,
    }));
  };

  const clearFilters = () => {
    // Clear cache when filters are reset to ensure fresh data
    if (typeof window !== 'undefined') {
      const keys = Object.keys(sessionStorage);
      keys.forEach((key) => {
        if (key.startsWith('fixnex_cache_admin-bookings-')) {
          removeCachedData(key.replace('fixnex_cache_', ''));
        }
      });
    }
    setFilters(defaultFilters);
  };

  const handleEditBooking = (booking: Booking) => {
    setEditingBooking(booking);
    setIsEditModalOpen(true);
  };

  const handleUpdateBooking = async (updatedData: {
    categoryName?: string | null;
    location?: string | null;
    serviceType?: string | null;
    scheduledDate?: string | null;
    timeSlot?: string | null;
    price?: string | null;
  }) => {
    if (!editingBooking) return;

    try {
      const response = await fetch(`/api/bookings/${editingBooking.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update booking");
      }

      setIsEditModalOpen(false);
      setEditingBooking(null);
      await fetchBookings();
    } catch (err) {
      console.error("Update booking error:", err);
      alert((err as Error).message || "Failed to update booking");
    }
  };

  const handleUpdateServices = async (
    servicesData: Array<{
      id: string;
      categoryName?: string | null;
      location?: string | null;
      serviceType?: string | null;
      scheduledDate?: string | null;
      timeSlot?: string | null;
      price?: string | null;
    }>,
    bookingStatus?: string | null
  ) => {
    if (!editingBooking) return;

    try {
      // Update each service individually
      const serviceUpdatePromises = servicesData.map((service) =>
        fetch(`/api/booking-cart-items/${service.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            categoryName: service.categoryName,
            location: service.location,
            serviceType: service.serviceType,
            scheduledDate: service.scheduledDate,
            timeSlot: service.timeSlot,
            price: service.price,
          }),
        })
      );

      const serviceResponses = await Promise.all(serviceUpdatePromises);
      const serviceErrors = serviceResponses.filter((r) => !r.ok);

      if (serviceErrors.length > 0) {
        const errorMessages = await Promise.all(
          serviceErrors.map(async (r) => {
            const error = await r.json();
            return error.message || "Failed to update service";
          })
        );
        throw new Error(`Failed to update some services: ${errorMessages.join(", ")}`);
      }

      // Update booking status separately after services are updated
      if (bookingStatus !== undefined && bookingStatus !== editingBooking.status) {
        const bookingResponse = await fetch(`/api/bookings/${editingBooking.id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: bookingStatus,
          }),
        });

        if (!bookingResponse.ok) {
          const error = await bookingResponse.json();
          throw new Error(error.message || "Failed to update booking status");
        }
      }

      // Clear all booking caches since data has changed
      if (typeof window !== 'undefined') {
        const keys = Object.keys(sessionStorage);
        keys.forEach((key) => {
          if (key.startsWith('fixnex_cache_admin-bookings-')) {
            removeCachedData(key.replace('fixnex_cache_', ''));
          }
        });
      }

      setIsEditModalOpen(false);
      setEditingBooking(null);
      await fetchBookings();
    } catch (err) {
      console.error("Update services error:", err);
      alert((err as Error).message || "Failed to update services");
    }
  };

  // Flatten services from bookings and group by booking ID
  const servicesByBooking = useMemo(() => {
    const grouped: Array<{
      bookingId: string;
      booking: Booking;
      services: BookingCartItem[];
    }> = [];

    bookings.forEach((booking) => {
      if (booking.bookingCartItems.length > 0) {
        grouped.push({
          bookingId: booking.id,
          booking,
          services: booking.bookingCartItems,
        });
      }
    });

    return grouped;
  }, [bookings]);

  const formattedSummary = useMemo(() => {
    const totalServices = servicesByBooking.reduce((sum, group) => sum + group.services.length, 0);
    
    if (totalServices === 0) {
      return "No services in the current view.";
    }

    const categories = new Set(
      servicesByBooking.flatMap((group) =>
        group.services.map((service) => service.category_name ?? "Uncategorised")
      )
    ).size;

    return `${totalServices} service${totalServices !== 1 ? "s" : ""} from ${servicesByBooking.length} booking${servicesByBooking.length !== 1 ? "s" : ""} across ${categories} categories.`;
  }, [servicesByBooking]);

  const formatDateTime = (value: string | null) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);
    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  const formatCurrency = (value: string | null) => {
    if (!value) {
      return "—";
    }

    const numeric = Number.parseFloat(value);
    if (!Number.isFinite(numeric)) {
      return value;
    }

    return new Intl.NumberFormat("en-AE", {
      style: "currency",
      currency: "AED",
      minimumFractionDigits: 2,
    }).format(numeric);
  };

  const paginationLabel = useMemo(() => {
    if (!bookings.length) {
      return "Showing 0 of 0";
    }

    const start = (pagination.page - 1) * pagination.pageSize + 1;
    const end = Math.min(pagination.page * pagination.pageSize, pagination.total);

    return `Showing ${start}-${end} of ${pagination.total}`;
  }, [bookings.length, pagination.page, pagination.pageSize, pagination.total]);

  const selectedDateLabel = useMemo(() => {
    if (filters.date) {
      const parsed = new Date(filters.date);
      return Number.isNaN(parsed.getTime())
        ? filters.date
        : parsed.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "2-digit",
          });
    }

    if (filters.startDate || filters.endDate) {
      return `${filters.startDate || "—"} → ${filters.endDate || "—"}`;
    }

    return "All dates";
  }, [filters.date, filters.startDate, filters.endDate]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.search) count++;
    if (filters.userName) count++;
    if (filters.location) count++;
    if (filters.serviceType) count++;
    if (filters.categoryName) count++;
    if (filters.status) count++;
    if (filters.date || filters.startDate || filters.endDate) count++;
    return count;
  }, [filters]);

  const canGoPrev = filters.page > 1 && !loading;
  const canGoNext = filters.page < (pagination.totalPages || 1) && !loading;

  if (checkingAuth) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
        <div className="flex flex-col items-center gap-3 text-center">
          <span className="text-sm uppercase tracking-[0.3em] text-slate-500">Verifying</span>
          <p className="text-lg font-semibold text-white">Checking admin permissions…</p>
        </div>
      </div>
    );
  }

  if (!isAuthorized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100 px-4">
        <div className="max-w-md rounded-2xl border border-rose-500/40 bg-rose-500/10 p-8 text-center shadow-lg">
          <p className="text-2xl font-semibold text-white">Access denied</p>
          <p className="mt-3 text-sm text-rose-100">
            {authError ?? "You do not have permission to view this page."}
          </p>
          <button
            type="button"
            onClick={() => router.push("/")}
            className="mt-6 inline-flex items-center justify-center rounded-lg bg-slate-100/10 px-4 py-2 text-sm font-semibold text-slate-100 transition hover:bg-slate-100/20"
          >
            Go to homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col overflow-hidden bg-slate-950 text-slate-100">
      <header className="shrink-0 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-lg font-semibold tracking-tight text-white">
              <span className="mr-2 inline-flex size-9 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-sky-600 text-base font-semibold text-slate-950 shadow-lg">
                fx
              </span>
              fix<span className="text-sky-400">nex</span> Admin
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => router.push("/admin-dashboard")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-xs sm:text-sm font-semibold text-slate-200 shadow-lg transition hover:border-sky-500 hover:text-sky-300 sm:px-4"
            >
              <span className="hidden sm:inline">Dashboard</span>
              <span className="sm:hidden">Dash</span>
            </button>
            {/* <button
              type="button"
              className="relative flex size-10 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
              aria-label="Notifications"
            >
              <BellIcon className="size-5" />
              <span className="absolute -right-0.5 -top-0.5 inline-flex size-2 rounded-full bg-sky-400 shadow" />
            </button> */}
            <div className="flex items-center gap-3">
              <div className="flex size-10 items-center justify-center rounded-full bg-linear-to-br from-sky-500 to-indigo-500 text-sm font-semibold text-slate-950">
                AD
              </div>
              <div className="text-left text-sm leading-tight">
                <p className="font-medium text-white">Admin</p>
                <p className="text-xs text-slate-400">Bookings</p>
              </div>
              <button
                type="button"
                className="flex size-9 items-center justify-center rounded-full border border-slate-800 bg-slate-900 text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
                aria-label="Open profile menu"
              >
                <CaretDownIcon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-8 overflow-hidden px-4 py-6 sm:px-6 sm:py-10">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">
              Bookings
            </h1>
            <p className="mt-1 text-sm text-slate-300">{formattedSummary}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-sm text-slate-300">
            <div className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2">
              <CalendarIcon className="size-4 text-sky-400" />
              <span>{selectedDateLabel}</span>
            </div>
            <button
              onClick={clearFilters}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 px-3 py-2 font-medium text-slate-200 transition hover:border-sky-500 hover:text-sky-300"
            >
              <RefreshIcon className="size-4 text-slate-300" />
              Reset
            </button>
          </div>
        </div>

        <section className="rounded-2xl border border-slate-800 bg-slate-900/60 shadow-lg backdrop-blur overflow-hidden transition-all duration-300">
          <button
            onClick={() => setIsFiltersExpanded(!isFiltersExpanded)}
            className="w-full flex items-center justify-between p-6 text-left transition hover:bg-slate-900/40"
          >
            <div className="flex items-center gap-3">
              <FilterIcon className="size-5 text-sky-400" />
              <div>
                <h2 className="text-lg font-semibold text-white">Filters</h2>
                {activeFiltersCount > 0 && (
                  <p className="text-xs text-slate-400 mt-0.5">
                    {activeFiltersCount} active filter{activeFiltersCount !== 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {activeFiltersCount > 0 && (
                <span className="inline-flex items-center justify-center rounded-full bg-sky-500 px-2 py-0.5 text-xs font-semibold text-white">
                  {activeFiltersCount}
                </span>
              )}
              <div
                className={`transition-transform duration-300 ${
                  isFiltersExpanded ? "rotate-180" : ""
                }`}
              >
                <CaretDownIcon className="size-5 text-slate-400" />
              </div>
            </div>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out ${
              isFiltersExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <div className="px-6 pb-6 space-y-6">
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <FilterSearch
                  label="Global search"
                  placeholder="Search in all fields"
                  value={filters.search}
                  onChange={(value) => handleFilterChange("search", value)}
                />

                <FilterSearch
                  label="User name"
                  placeholder="Search by customer"
                  value={filters.userName}
                  onChange={(value) => handleFilterChange("userName", value)}
                />

                <FilterSearch
                  label="Location"
                  placeholder="e.g. Dubai Marina"
                  value={filters.location}
                  onChange={(value) => handleFilterChange("location", value)}
                />

                <FilterSearch
                  label="Service type"
                  placeholder="Cleaning, Maintenance..."
                  value={filters.serviceType}
                  onChange={(value) => handleFilterChange("serviceType", value)}
                />

                <FilterSearch
                  label="Category"
                  placeholder="Home services..."
                  value={filters.categoryName}
                  onChange={(value) => handleFilterChange("categoryName", value)}
                />

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Status
                  </label>
                  <div className="relative">
                    <select
                      value={filters.status}
                      onChange={(event) => handleFilterChange("status", event.target.value)}
                      className="block w-full appearance-none rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner focus:border-sky-500 focus:outline-none"
                    >
                      <option value="">All statuses</option>
                      {bookingStatusOptions.map((status) => (
                        <option key={status} value={status}>
                          {status.charAt(0) + status.slice(1).toLowerCase()}
                        </option>
                      ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                      <CaretDownIcon className="size-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                <DateInput
                  label="Specific date"
                  value={filters.date}
                  onChange={(value) => handleDateChange("date", value)}
                />
                <DateInput
                  label="Start date"
                  value={filters.startDate}
                  onChange={(value) => handleDateChange("startDate", value)}
                />
                <DateInput
                  label="End date"
                  value={filters.endDate}
                  onChange={(value) => handleDateChange("endDate", value)}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="flex w-full flex-col space-y-4 overflow-hidden">
          <div className="shrink-0 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white md:text-xl">All Services</h2>
              <p className="text-sm text-slate-400">{paginationLabel}</p>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2">
                <span className="text-slate-400">Page size</span>
                <select
                  className="bg-transparent text-sm text-white focus:outline-none"
                  value={filters.pageSize}
                  onChange={(event) =>
                    handleFilterChange("pageSize", Number(event.target.value), false)
                  }
                >
                  {[10, 20, 50, 100].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-slate-700 bg-slate-950 px-4 py-2">
                <button
                  className="rounded-full px-2 py-1 text-slate-400 transition hover:text-white disabled:opacity-40"
                  disabled={!canGoPrev}
                  onClick={() => handleFilterChange("page", Math.max(1, filters.page - 1), false)}
                >
                  Previous
                </button>
                <span className="text-slate-200">
                  Page {pagination.page} / {pagination.totalPages || 1}
                </span>
                <button
                  className="rounded-full px-2 py-1 text-slate-400 transition hover:text-white disabled:opacity-40"
                  disabled={!canGoNext}
                  onClick={() =>
                    handleFilterChange(
                      "page",
                      Math.min(
                        pagination.totalPages || pagination.page,
                        filters.page + 1
                      ),
                      false
                    )
                  }
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {error && !loading && (
            <div className="shrink-0 rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm text-rose-100">
              <div className="flex items-start justify-between gap-3">
                <span>{error}</span>
                <button
                  className="rounded-full border border-rose-200/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-50 transition hover:border-rose-50 hover:text-white"
                  onClick={() => fetchBookings()}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          <div className="flex flex-col rounded-2xl border border-slate-800 bg-slate-900/40 shadow-xl overflow-hidden">
            <div className="overflow-x-auto -mx-px">
              <table className="min-w-full divide-y divide-slate-800 text-sm">
                <thead className="bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <tr>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Booking ID</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Customer</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Booking Status</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Edit</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Service Name</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Location</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Scheduled Date</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4">Time Slot</th>
                    <th scope="col" className="whitespace-nowrap px-2 py-3 sm:px-4 text-right">Price</th>
                    {/* <th scope="col" className="whitespace-nowrap px-4 py-3">Actions</th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-900/80">
                  {loading &&
                    Array.from({ length: Math.min(5, filters.pageSize) }).map((_, index) => (
                      <tr key={`skeleton-${index}`} className="animate-pulse">
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-24" />
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-32" />
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-24" />
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-28" />
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-24" />
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-28" />
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-20" />
                        </td>
                        <td className="px-2 py-4 sm:px-4">
                          <SkeletonLine width="w-20" />
                        </td>
                        <td className="px-2 py-4 sm:px-4 text-right">
                          <SkeletonLine width="w-16" />
                        </td>
                      </tr>
                    ))}

                  {!loading && !error && servicesByBooking.length === 0 && (
                    <tr>
                      <td colSpan={9} className="px-4 py-10 text-center text-sm text-slate-400">
                        No services match the current filters. Adjust your search or reset the filters.
                      </td>
                    </tr>
                  )}

                  {!loading &&
                    servicesByBooking.map((group, groupIndex) => (
                      <Fragment key={group.bookingId}>
                        {group.services.map((service, serviceIndex) => (
                          <tr
                            key={`${group.bookingId}-${service.id}`}
                            className={`transition hover:bg-slate-900/50 ${
                              serviceIndex === 0 ? "border-t-2 border-sky-500/30" : ""
                            }`}
                          >
                            {serviceIndex === 0 && (
                              <>
                                <td
                                  rowSpan={group.services.length}
                                  className="whitespace-nowrap px-2 py-4 sm:px-4 font-medium text-slate-100 align-top border-r border-slate-800/50"
                                >
                                  <div className="flex flex-col gap-1">
                                    <span className="text-xs sm:text-sm break-all">{group.bookingId}</span>
                                    <span className="text-xs text-slate-400">
                                      {group.services.length} service{group.services.length !== 1 ? "s" : ""}
                                    </span>
                                  </div>
                                </td>
                                <td
                                  rowSpan={group.services.length}
                                  className="whitespace-nowrap px-2 py-4 sm:px-4 text-slate-200 align-top border-r border-slate-800/50"
                                >
                                  <span className="text-xs sm:text-sm">{getUserDisplayName(group.booking)}</span>
                                </td>
                                <td
                                  rowSpan={group.services.length}
                                  className="whitespace-nowrap px-2 py-4 sm:px-4 align-top border-r border-slate-800/50"
                                >
                                  <StatusBadge status={group.booking.status} />
                                </td>
                                <td
                                  rowSpan={group.services.length}
                                  className="px-2 py-4 sm:px-4 align-top"
                                >
                                  <button
                                    onClick={() => handleEditBooking(group.booking)}
                                    className="inline-flex items-center gap-1 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20 hover:border-sky-500/50 sm:gap-1.5 sm:px-3 sm:py-1.5"
                                  >
                                    <EditIcon className="size-3 sm:size-3.5" />
                                    <span className="hidden sm:inline">Edit</span>
                                  </button>
                                </td>
                              </>
                            )}
                            <td className="whitespace-nowrap px-2 py-4 sm:px-4 text-slate-300 text-xs sm:text-sm">
                              {service.services?.name ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 sm:px-4 text-slate-300 text-xs sm:text-sm">
                              {service.location ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 sm:px-4 text-slate-300 text-xs sm:text-sm">
                              {formatDateTime(service.scheduled_date)}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 sm:px-4 text-slate-300 text-xs sm:text-sm">
                              {service.time_slot ?? "—"}
                            </td>
                            <td className="whitespace-nowrap px-2 py-4 sm:px-4 text-right text-slate-200 text-xs sm:text-sm">
                              {formatCurrency(service.price)}
                            </td>
                          </tr>
                        ))}
                      </Fragment>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>

      {isEditModalOpen && editingBooking && (
        <EditBookingModal
          booking={editingBooking}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingBooking(null);
          }}
          onSaveServices={handleUpdateServices}
          formatDateTime={formatDateTime}
          formatCurrency={formatCurrency}
        />
      )}
    </div>
  );
};

const FilterSearch = ({
  label,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </label>
    <div className="flex items-center gap-3 rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 shadow-inner focus-within:border-sky-500">
      <SearchIcon className="size-4 text-slate-500" />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
      />
    </div>
  </div>
);

const DateInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) => (
  <div className="flex flex-col gap-2">
    <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
      {label}
    </label>
    <input
      type="date"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-white shadow-inner focus:border-sky-500 focus:outline-none"
    />
  </div>
);

const getUserDisplayName = (booking: Booking) => {
  if (booking.user?.fullName && booking.user.fullName.trim().length > 0) {
    return booking.user.fullName;
  }
  if (booking.user?.email) {
    return booking.user.email;
  }
  if (booking.bookingCartItems.length > 0) {
    const firstItem = booking.bookingCartItems[0];
    return (
      firstItem.location ??
      firstItem.service_type ??
      firstItem.category_name ??
      "Anonymous"
    );
  }
  return "Anonymous";
};

const StatusBadge = ({ status }: { status: string }) => {
  const normalized = status?.toUpperCase?.() ?? "PENDING";
  const style = bookingStatusStyles[normalized] ?? bookingStatusStyles.PENDING;

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${style}`}
    >
      {normalized}
    </span>
  );
};

const LinkedServicesCell = ({
  items,
  formatCurrency,
  formatDateTime,
}: {
  items: BookingCartItem[];
  formatCurrency: (value: string | null) => string;
  formatDateTime: (value: string | null) => string;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [buttonRef, setButtonRef] = useState<HTMLButtonElement | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<{ top: number; right: number } | null>(null);

  useEffect(() => {
    if (isExpanded && buttonRef) {
      const updatePosition = () => {
        const rect = buttonRef.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + 4,
          right: window.innerWidth - rect.right,
        });
      };

      updatePosition();
      window.addEventListener("scroll", updatePosition, true);
      window.addEventListener("resize", updatePosition);

      return () => {
        window.removeEventListener("scroll", updatePosition, true);
        window.removeEventListener("resize", updatePosition);
      };
    } else {
      setDropdownPosition(null);
    }
  }, [isExpanded, buttonRef]);

  useEffect(() => {
    if (!isExpanded) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (buttonRef && !buttonRef.contains(event.target as Node)) {
        const dropdown = document.getElementById(`dropdown-${items[0]?.id}`);
        if (dropdown && !dropdown.contains(event.target as Node)) {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded, buttonRef, items]);

  return (
    <>
      <div className="relative">
        <button
          ref={setButtonRef}
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-1.5 rounded-lg border border-sky-500/30 bg-sky-500/10 px-2 py-1 text-xs font-medium text-sky-300 transition hover:bg-sky-500/20 hover:border-sky-500/50"
        >
          <FilterIcon className="size-3" />
          <span>{items.length}</span>
          <div
            className={`transition-transform duration-200 ${
              isExpanded ? "rotate-180" : ""
            }`}
          >
            <CaretDownIcon className="size-3" />
          </div>
        </button>
      </div>

      {isExpanded && dropdownPosition && (
        <div
          id={`dropdown-${items[0]?.id}`}
          className="fixed z-50 rounded-lg border border-slate-800 bg-slate-950 shadow-xl"
          style={{
            top: `${dropdownPosition.top}px`,
            right: `${dropdownPosition.right}px`,
            width: "400px",
            maxHeight: "calc(100vh - " + (dropdownPosition.top + 20) + "px)",
          }}
        >
          <div className="max-h-[500px] overflow-y-auto p-3">
            <div className="mb-2 flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-semibold text-slate-300">
                Linked Services ({items.length})
              </span>
              <button
                onClick={() => setIsExpanded(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Close
              </button>
            </div>
            <div className="space-y-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-slate-800/50 bg-slate-900/50 p-2.5 text-xs"
                >
                  <p className="mb-1.5 text-xs font-semibold text-white">
                    {item.service_type ?? "Service"}
                  </p>
                  <div className="space-y-0.5 text-slate-400">
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Category:</span>
                      <span className="text-slate-300">{item.category_name ?? "—"}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Location:</span>
                      <span className="text-slate-300 truncate">{item.location ?? "—"}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Time:</span>
                      <span className="text-slate-300">{item.time_slot ?? "—"}</span>
                    </div>
                    <div className="flex justify-between gap-2">
                      <span className="text-slate-500">Date:</span>
                      <span className="text-slate-300 text-[10px]">
                        {formatDateTime(item.scheduled_date)}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 border-t border-slate-800/50 pt-0.5">
                      <span className="font-medium text-slate-500">Price:</span>
                      <span className="font-semibold text-slate-200">
                        {formatCurrency(item.price)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const SkeletonLine = ({ width }: { width?: string }) => (
  <span
    className={`block h-3 rounded-full bg-slate-800/70 ${width ?? "w-full"}`}
  />
);

const RefreshIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 12a9 9 0 1 1 3 6.708"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M3 12V7M3 12h5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BellIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 3C9.79086 3 8 4.79086 8 7V8.05557C8 8.6478 7.78945 9.22033 7.40778 9.67128L6.22532 11.0681C5.44758 11.9909 5 13.163 5 14.3737V15.5C5 16.3284 5.67157 17 6.5 17H17.5C18.3284 17 19 16.3284 19 15.5V14.3737C19 13.163 18.5524 11.9909 17.7747 11.0681L16.5922 9.67128C16.2106 9.22033 16 8.6478 16 8.05557V7C16 4.79086 14.2091 3 12 3Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 20C10.5304 20.5978 11.2288 21 12 21C12.7712 21 13.4696 20.5978 14 20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CaretDownIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M5 7L10 12L15 7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="4"
      y="5"
      width="16"
      height="15"
      rx="2"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M16 3V7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M8 3V7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M4 11H20"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 4V15"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M6 9L12 15L18 9"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M5 19H19"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const SearchIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="11"
      cy="11"
      r="6"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path
      d="M20 20L16.65 16.65"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const FilterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6H20M7 12H17M10 18H14"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const EditIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18.5 2.50023C18.8978 2.10243 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.10243 21.5 2.50023C21.8978 2.89804 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.10243 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const EditBookingModal = ({
  booking,
  onClose,
  onSaveServices,
  formatDateTime,
  formatCurrency,
}: {
  booking: Booking;
  onClose: () => void;
  onSaveServices: (
    servicesData: Array<{
      id: string;
      categoryName?: string | null;
      location?: string | null;
      serviceType?: string | null;
      scheduledDate?: string | null;
      timeSlot?: string | null;
      price?: string | null;
    }>,
    bookingStatus?: string | null
  ) => Promise<void>;
  formatDateTime: (value: string | null) => string;
  formatCurrency: (value: string | null) => string;
}) => {
  const [servicesData, setServicesData] = useState(
    booking.bookingCartItems.map((item) => ({
      id: item.id,
      categoryName: item.category_name ?? "",
      location: item.location ?? "",
      serviceType: item.service_type ?? "",
      scheduledDate: item.scheduled_date
        ? new Date(item.scheduled_date).toISOString().split("T")[0]
        : "",
      timeSlot: item.time_slot ?? "",
      price: item.price ?? "",
    }))
  );
  const [bookingStatus, setBookingStatus] = useState(booking.status);
  const [isSaving, setIsSaving] = useState(false);

  const handleServiceChange = (index: number, field: string, value: string) => {
    setServicesData((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      await onSaveServices(
        servicesData.map((service) => ({
          id: service.id,
          categoryName: service.categoryName || null,
          location: service.location || null,
          serviceType: service.serviceType || null,
          scheduledDate: service.scheduledDate || null,
          timeSlot: service.timeSlot || null,
          price: service.price || null,
        })),
        bookingStatus
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl flex flex-col">
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4 shrink-0">
          <div>
            <h2 className="text-xl font-semibold text-white">Edit Booking Services</h2>
            <p className="text-xs text-slate-400 mt-1">
              Booking ID: {booking.id} • {booking.bookingCartItems.length} service{booking.bookingCartItems.length !== 1 ? "s" : ""}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-900 hover:text-white"
          >
            <CloseIcon className="size-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-4">
              <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Booking Information
              </p>
              <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                <div>
                  <span className="text-slate-500">Customer:</span>
                  <span className="ml-2 font-medium text-slate-200">
                    {getUserDisplayName(booking)}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Total Services:</span>
                  <span className="ml-2 font-medium text-slate-200">
                    {booking.bookingCartItems.length}
                  </span>
                </div>
                <div>
                  <span className="text-slate-500">Current Status:</span>
                  <span className="ml-2">
                    <StatusBadge status={booking.status} />
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  Update Booking Status
                </label>
                <div className="relative">
                  <select
                    value={bookingStatus}
                    onChange={(e) => setBookingStatus(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white shadow-inner focus:border-sky-500 focus:outline-none"
                  >
                    {bookingStatusOptions.map((status) => (
                      <option key={status} value={status}>
                        {status.charAt(0) + status.slice(1).toLowerCase()}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-500">
                    <CaretDownIcon className="size-4" />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                Services ({servicesData.length})
              </h3>
              {servicesData.map((service, index) => (
                <div
                  key={service.id}
                  className="rounded-lg border border-slate-800 bg-slate-900/50 p-4"
                >
                  <div className="mb-4 flex items-center justify-between border-b border-slate-800 pb-2">
                    <h4 className="text-sm font-semibold text-white">
                      Service {index + 1}
                    </h4>
                    <span className="text-xs text-slate-500">ID: {service.id}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Category Name
                      </label>
                      <input
                        type="text"
                        value={service.categoryName}
                        onChange={(e) =>
                          handleServiceChange(index, "categoryName", e.target.value)
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                        placeholder="Category name"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Location
                      </label>
                      <input
                        type="text"
                        value={service.location}
                        onChange={(e) =>
                          handleServiceChange(index, "location", e.target.value)
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                        placeholder="Location"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Service Type
                      </label>
                      <input
                        type="text"
                        value={service.serviceType}
                        onChange={(e) =>
                          handleServiceChange(index, "serviceType", e.target.value)
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                        placeholder="Service type"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Scheduled Date
                      </label>
                      <input
                        type="date"
                        value={service.scheduledDate}
                        onChange={(e) =>
                          handleServiceChange(index, "scheduledDate", e.target.value)
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Time Slot
                      </label>
                      <input
                        type="text"
                        value={service.timeSlot}
                        onChange={(e) =>
                          handleServiceChange(index, "timeSlot", e.target.value)
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                        placeholder="Time slot"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Price
                      </label>
                      <input
                        type="text"
                        value={service.price}
                        onChange={(e) =>
                          handleServiceChange(index, "price", e.target.value)
                        }
                        className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none"
                        placeholder="Price"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="sticky bottom-0 mt-6 flex justify-end gap-3 border-t border-slate-800 bg-slate-950 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-700 px-4 py-2 text-sm font-medium text-slate-300 transition hover:border-slate-600 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-semibold text-white shadow-lg transition hover:shadow-xl disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CloseIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M18 6L6 18M6 6L18 18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const AdminPage = () => {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-950 text-slate-100">
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-sm uppercase tracking-[0.3em] text-slate-500">Loading</span>
            <p className="text-lg font-semibold text-white">Loading admin page…</p>
          </div>
        </div>
      }
    >
      <AdminPageContent />
    </Suspense>
  );
};

export default AdminPage;