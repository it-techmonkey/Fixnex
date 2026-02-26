'use client';

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
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

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      setError(null);
      try {
        const body = await fetchWithCache<DashboardResponse>(
          'admin-dashboard',
          async () => {
            const response = await fetch("/api/admin", { method: "GET", cache: "no-store" });
            if (!response.ok) {
              const errData = await response.json().catch(() => ({}));
              throw new Error(errData.message ?? "Unable to load metrics.");
            }
            return (await response.json()) as DashboardResponse;
          },
          { ttl: 30 * 1000, useStaleWhileRevalidate: true }
        );
        setData(body);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  const handleStatClick = useCallback((statType: string) => {
    const params = new URLSearchParams();
    params.set('page', '1');
    switch (statType) {
      case 'active': params.set('status', 'PENDING'); break;
      case 'completed': params.set('status', 'COMPLETED'); break;
      case 'cancelled': params.set('status', 'CANCELLED'); break;
      case '30d': {
        const end = new Date();
        const start = new Date(); start.setDate(start.getDate() - 30);
        params.set('startDate', start.toISOString().split('T')[0]);
        params.set('endDate', end.toISOString().split('T')[0]);
        break;
      }
      default: break;
    }
    router.push(`/admin${params.toString() ? `?${params}` : ''}`);
  }, [router]);

  const stats = useMemo(() => {
    const t = data?.totals;
    return [
      { label: "Total bookings", value: t?.totalBookings ?? 0, desc: "All time", accent: "sky", statType: 'total' as const },
      { label: "Active", value: t?.activeBookings ?? 0, desc: "Pending / in progress", accent: "indigo", statType: 'active' as const },
      { label: "Completed", value: t?.completedBookings ?? 0, desc: "Fulfilled", accent: "emerald", statType: 'completed' as const },
      { label: "Cancelled", value: t?.cancelledBookings ?? 0, desc: "Cancelled or rejected", accent: "rose", statType: 'cancelled' as const },
      { label: "Last 30 days", value: t?.newBookingsLast30Days ?? 0, desc: "New bookings", accent: "amber", statType: '30d' as const },
    ];
  }, [data]);

  const accentClasses: Record<string, string> = {
    sky: "from-sky-400 to-sky-600",
    indigo: "from-indigo-400 to-fuchsia-500",
    emerald: "from-emerald-400 to-lime-500",
    rose: "from-rose-400 to-orange-500",
    amber: "from-amber-400 to-pink-500",
  };

  return (
    <AdminLayout title="Dashboard" currentNav="dashboard">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        {/* Welcome + refresh */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Overview</h2>
            <p className="mt-1 text-sm text-slate-400">
              {data?.generatedAt
                ? `Updated ${new Date(data.generatedAt).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short" })}`
                : "Loading…"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => { removeCachedData('admin-dashboard'); window.location.reload(); }}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-700 bg-slate-800/80 px-4 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-500/50 hover:bg-slate-800 hover:text-white"
            >
              Refresh
            </button>
            <Link
              href="/admin"
              className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
            >
              View all bookings
            </Link>
          </div>
        </div>

        {error && (
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 px-4 py-4 sm:p-5">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-rose-100">{error}</p>
              <button
                onClick={() => { removeCachedData("admin-dashboard"); window.location.reload(); }}
                className="shrink-0 rounded-lg border border-rose-300/30 px-3 py-2 text-xs font-semibold text-rose-50 hover:bg-rose-500/20"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats grid */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5">
                  <div className="h-4 w-24 rounded bg-slate-800/70" />
                  <div className="mt-3 h-8 w-16 rounded bg-slate-800/70" />
                  <div className="mt-2 h-3 w-full max-w-[120px] rounded bg-slate-800/70" />
                </div>
              ))
            : stats.map((stat) => (
                <button
                  key={stat.statType}
                  type="button"
                  onClick={() => handleStatClick(stat.statType)}
                  className="group relative overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-5 text-left shadow-lg transition hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-500/5"
                >
                  <div className={`absolute inset-x-0 top-0 h-1 bg-linear-to-r ${accentClasses[stat.accent] ?? accentClasses.sky} opacity-90`} />
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-semibold tabular-nums text-white sm:text-3xl">{stat.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{stat.desc}</p>
                </button>
              ))}
        </section>

        {/* Charts row - min-w-0 prevents grid children from overflowing */}
        <div className="grid min-h-0 gap-4 sm:gap-6 lg:grid-cols-2 lg:min-h-0">
          <div className="min-w-0 overflow-hidden">
            <TrendingServices isAuthorized />
          </div>
          <div className="min-w-0 overflow-hidden">
            <BookingsCalendar isAuthorized />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboardPage;
