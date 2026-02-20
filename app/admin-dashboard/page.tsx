'use client';

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import BookingsCalendar from "@/app/components/admin/BookingsCalendar";
import TrendingServices from "@/app/components/admin/TrendingServices";
import { fetchWithCache, removeCachedData } from "@/app/utils/cache";

type DashboardTotals = {
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  newBookingsLast30Days: number;
  uniqueCustomers: number;
};

type DashboardResponse = {
  message: string;
  generatedAt: string;
  totals: DashboardTotals;
};

const AdminDashboardPage = () => {
  const router = useRouter();
  const [data, setData] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

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

        const sessionData = await response.json();
        const role = sessionData?.user?.role;

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

  useEffect(() => {
    if (!isAuthorized) {
      return;
    }

    const loadDashboard = async () => {
      setLoading(true);
      setError(null);

      try {
        const body = await fetchWithCache<DashboardResponse>(
          'admin-dashboard',
          async () => {
            const response = await fetch("/api/admin", {
              method: "GET",
              cache: "no-store",
            });

            if (!response.ok) {
              // Try to get error details from response
              let errorMessage = "Unable to load admin metrics. Please try again.";
              try {
                const errorData = await response.json();
                errorMessage = errorData.message || errorMessage;
              } catch {
                // If response is not JSON, use status text
                errorMessage = `Error ${response.status}: ${response.statusText || errorMessage}`;
              }
              throw new Error(errorMessage);
            }

            return (await response.json()) as DashboardResponse;
          },
          {
            ttl: 30 * 1000, // 30 seconds cache
            useStaleWhileRevalidate: true,
          }
        );

        setData(body);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
        console.error("Dashboard load error:", err);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [isAuthorized]);

  const handleStatClick = (statType: string) => {
    const params = new URLSearchParams();
    
    switch (statType) {
      case 'total':
        // No status filter - show all bookings
        // Reset to page 1
        params.set('page', '1');
        break;
      case 'active':
        // Active bookings = PENDING or ONGOING
        // Using PENDING as primary filter (most common active status)
        // Users can manually add ONGOING filter if needed
        params.set('status', 'PENDING');
        params.set('page', '1');
        break;
      case 'completed':
        params.set('status', 'COMPLETED');
        params.set('page', '1');
        break;
      case 'cancelled':
        // For cancelled/rejected, using CANCELLED as primary
        // Users can manually filter for REJECTED if needed
        params.set('status', 'CANCELLED');
        params.set('page', '1');
        break;
      case '30d':
        // Last 30 days - calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 30);
        params.set('startDate', startDate.toISOString().split('T')[0]);
        params.set('endDate', endDate.toISOString().split('T')[0]);
        params.set('page', '1');
        break;
      default:
        break;
    }
    
    const queryString = params.toString();
    router.push(`/admin${queryString ? `?${queryString}` : ''}`);
  };

  const stats = useMemo(() => {
    const totals = data?.totals;
    return [
      {
        label: "Total bookings",
        value: totals?.totalBookings ?? 0,
        description: "Lifetime bookings created",
        accent: "from-sky-400 to-sky-600",
        statType: 'total',
      },
      {
        label: "Active bookings",
        value: totals?.activeBookings ?? 0,
        description: "Currently in-progress or pending",
        accent: "from-indigo-400 to-fuchsia-500",
        statType: 'active',
      },
      {
        label: "Completed bookings",
        value: totals?.completedBookings ?? 0,
        description: "Successfully fulfilled",
        accent: "from-emerald-400 to-lime-500",
        statType: 'completed',
      },
      {
        label: "Cancelled / Rejected",
        value: totals?.cancelledBookings ?? 0,
        description: "Customer or admin cancellations",
        accent: "from-rose-400 to-orange-500",
        statType: 'cancelled',
      },
      {
        label: "Bookings (30d)",
        value: totals?.newBookingsLast30Days ?? 0,
        description: "Created in the past 30 days",
        accent: "from-amber-400 to-pink-500",
        statType: '30d',
      },
      // {
      //   label: "Unique customers",
      //   value: totals?.uniqueCustomers ?? 0,
      //   description: "Customers who placed a booking",
      //   accent: "from-cyan-400 to-blue-500",
      // },
    ];
  }, [data]);

  const generatedAtLabel = data
    ? new Date(data.generatedAt).toLocaleString("en-GB", {
        year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

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
          <p className="mt-3 text-sm text-rose-100">{authError ?? "You do not have permission to view this page."}</p>
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
    <div className="flex  flex-col bg-slate-950 text-slate-100">
      <header className="shrink-0 border-b border-slate-800 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center text-lg font-semibold tracking-tight text-white">
              <span className="mr-2 inline-flex size-9 items-center justify-center rounded-full bg-linear-to-br from-sky-400 to-sky-600 text-base font-semibold text-slate-950 shadow-lg">
                fx
              </span>
              fix<span className="text-sky-400">nex</span> Admin
            </span>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 shadow-lg transition hover:border-sky-500 hover:text-sky-300"
            >
              Home
            </button>
            <button
              type="button"
              onClick={() => router.push("/admin")}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 shadow-lg transition hover:border-sky-500 hover:text-sky-300"
            >
              Bookings
            </button>
            <button
              type="button"
              onClick={() => {
                removeCachedData('admin-dashboard');
                window.location.reload();
              }}
              className="inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-200 shadow-lg transition hover:border-sky-500 hover:text-sky-300"
            >
              Refresh
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
                <p className="text-xs text-slate-400">Dashboard</p>
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

      <main className="mx-auto flex w-full  flex-1 flex-col gap-8 px-20 py-10">
        {error && (
          <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 p-5 text-rose-100 shadow-lg">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-rose-200">
                  Something went wrong
                </p>
                <p className="text-sm text-rose-100/90">{error}</p>
              </div>
              <button
                onClick={() => {
                  removeCachedData('admin-dashboard');
                  window.location.reload();
                }}
                className="rounded-lg border border-rose-200/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-rose-50 transition hover:border-rose-50 hover:text-white"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-6">
          {loading &&
            Array.from({ length: 6 }).map((_, index) => (
              <div
                key={`skeleton-${index}`}
                className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg"
              >
                <div className="space-y-3">
                  <div className="h-3 w-1/3 rounded-full bg-slate-800/80" />
                  <div className="h-8 w-1/2 rounded-full bg-slate-800/80" />
                  <div className="h-3 w-2/3 rounded-full bg-slate-800/80" />
                </div>
              </div>
            ))}

          {!loading &&
            stats.map((stat) => (
              <article
                key={stat.label}
                onClick={() => handleStatClick(stat.statType)}
                className="relative overflow-hidden rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg transition hover:border-sky-500/40 hover:shadow-xl cursor-pointer group"
              >
                <div
                  aria-hidden
                  className={`pointer-events-none absolute inset-x-0 top-0 h-2 bg-linear-to-r ${stat.accent} transition-opacity group-hover:opacity-80`}
                />
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                  {stat.label}
                </p>
                <p className="mt-3 text-4xl font-semibold text-white group-hover:text-sky-300 transition-colors">
                  {stat.value}
                </p>
                <p className="mt-2 text-sm text-slate-400 group-hover:text-slate-300 transition-colors">
                  {stat.description}
                </p>
                <div className="absolute inset-0 rounded-2xl bg-sky-500/0 group-hover:bg-sky-500/5 transition-colors pointer-events-none" />
              </article>
            ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-2">
          <TrendingServices isAuthorized={isAuthorized} />
          <BookingsCalendar isAuthorized={isAuthorized} />
        </div>
      </main>
    </div>
  );
};

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

export default AdminDashboardPage;