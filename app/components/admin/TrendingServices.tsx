'use client';

import { useCallback, useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, Legend } from "recharts";
import { fetchWithCache } from "@/app/utils/cache";

type TrendingService = {
  serviceId: string;
  serviceName: string;
  categoryName: string;
  icon: string;
  bookingCount: number;
  uniqueBookingCount: number;
};

type TrendingServicesResponse = {
  message: string;
  period: string;
  startDate: string;
  endDate: string;
  totalServices: number;
  trendingServices: TrendingService[];
};

type TrendingServicesProps = {
  isAuthorized: boolean;
};

const TrendingServices = ({ isAuthorized }: TrendingServicesProps) => {
  const [period, setPeriod] = useState<'day' | 'week' | 'month' | 'year'>('month');
  const [data, setData] = useState<TrendingServicesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTrendingServices = useCallback(async (selectedPeriod: 'day' | 'week' | 'month' | 'year') => {
    if (!isAuthorized) return;

    setLoading(true);
    setError(null);

    try {
      const cacheKey = `admin-trending-services-${selectedPeriod}`;
      
      const body = await fetchWithCache<TrendingServicesResponse>(
        cacheKey,
        async () => {
          const response = await fetch(
            `/api/admin/trending?period=${selectedPeriod}`,
            {
              method: "GET",
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch trending services");
          }

          return (await response.json()) as TrendingServicesResponse;
        },
        {
          ttl: 30 * 1000, // 30 seconds cache
          useStaleWhileRevalidate: true,
        }
      );

      setData(body);
    } catch (err) {
      setError((err as Error).message ?? "Something went wrong.");
      console.error("Failed to load trending services:", err);
    } finally {
      setLoading(false);
    }
  }, [isAuthorized]);

  useEffect(() => {
    if (isAuthorized) {
      fetchTrendingServices(period);
    }
  }, [isAuthorized, period, fetchTrendingServices]);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const periodOptions: Array<{ value: 'day' | 'week' | 'month' | 'year'; label: string }> = [
    { value: 'day', label: 'Today' },
    { value: 'week', label: 'Last 7 Days' },
    { value: 'month', label: 'Last Month' },
    { value: 'year', label: 'Last Year' },
  ];

  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-800/80 bg-slate-900/50 p-4 shadow-lg sm:p-5 lg:p-6">
      {/* Header */}
      <div className="mb-4 flex flex-col gap-3 sm:mb-5 sm:flex-row sm:items-center sm:justify-between lg:mb-6">
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-white sm:text-lg lg:text-xl">Trending Services</h2>
          {data && (
            <p className="mt-1 truncate text-xs text-slate-400 sm:text-sm">
              {formatDate(data.startDate)} – {formatDate(data.endDate)}
            </p>
          )}
        </div>

        {/* Period Filter */}
        <div className="flex shrink-0 flex-wrap gap-2">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              disabled={loading}
              className={`min-h-[36px] rounded-lg border px-3 py-2 text-xs font-semibold transition-colors sm:min-h-[32px] sm:py-1.5 ${
                period === option.value
                  ? "border-sky-500 bg-sky-500/20 text-sky-300"
                  : "border-slate-700 bg-slate-900 text-slate-300 hover:border-slate-600"
              } disabled:opacity-50`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="rounded-lg border border-slate-800/80 bg-slate-900/50 p-3 sm:p-4"
            >
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="h-10 w-10 shrink-0 rounded-lg bg-slate-800/60 sm:h-12 sm:w-12" />
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="h-4 w-3/4 max-w-[200px] rounded bg-slate-800/60" />
                  <div className="h-3 w-1/2 max-w-[120px] rounded bg-slate-800/60" />
                </div>
                <div className="h-6 w-14 shrink-0 rounded bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-center sm:p-5">
          <p className="text-sm text-rose-100">{error}</p>
          <button
            type="button"
            onClick={() => fetchTrendingServices(period)}
            className="mt-3 min-h-[40px] rounded-lg border border-rose-200/30 px-4 py-2 text-xs font-semibold text-rose-50 transition-colors hover:border-rose-50 hover:bg-rose-500/20 hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : !data || data.trendingServices.length === 0 ? (
        <div className="rounded-xl border border-slate-800/80 bg-slate-900/50 p-6 text-center sm:p-8">
          <p className="text-sm text-slate-400">No trending services found for this period</p>
        </div>
      ) : (
        <div className="min-w-0 w-full overflow-hidden">
          <div className="h-[220px] w-full min-h-0 overflow-hidden sm:h-[280px] lg:h-[340px] xl:h-[380px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data.trendingServices.slice(0, 10).map((service, index) => {
                const name = service.serviceName;
                const shortName = name.length > 12 ? `${name.slice(0, 12)}…` : name;
                return {
                  name: shortName,
                  fullName: service.serviceName,
                  category: service.categoryName,
                  bookings: service.bookingCount,
                  uniqueBookings: service.uniqueBookingCount,
                  rank: index + 1,
                };
              })}
              margin={{ top: 8, right: 8, left: -8, bottom: 40 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={72}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                interval={0}
              />
              <YAxis
                width={28}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 10 }}
                label={{ value: 'Bookings', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 10 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1e293b',
                  border: '1px solid #334155',
                  borderRadius: '8px',
                  color: '#f1f5f9',
                }}
                formatter={(value: number, name: string, props: any) => {
                  if (name === 'bookings') {
                    const uniqueText = props.payload.uniqueBookings !== value 
                      ? ` (${props.payload.uniqueBookings} unique)`
                      : '';
                    return [`${value} bookings${uniqueText}`, 'Bookings'];
                  }
                  return [value, name];
                }}
                labelFormatter={(label, payload) => {
                  if (payload && payload[0]) {
                    return payload[0].payload.fullName;
                  }
                  return label;
                }}
                labelStyle={{ color: '#f1f5f9', marginBottom: '4px', fontWeight: 'bold' }}
              />
              <Bar
                dataKey="bookings"
                radius={[8, 8, 0, 0]}
              >
                {data.trendingServices.slice(0, 10).map((_, index) => {
                  // Blue gradient from light to dark
                  const blueGradients = [
                    '#60a5fa', // Light blue (sky-400)
                    '#3b82f6', // Blue (sky-500)
                    '#2563eb', // Blue (sky-600)
                    '#1d4ed8', // Blue (sky-700)
                    '#1e40af', // Blue (sky-800)
                    '#1e3a8a', // Blue (sky-900)
                    '#1d3a8a', // Darker blue
                    '#172554', // Very dark blue
                    '#0f172a', // Darkest blue
                    '#0a0e1a', // Almost black blue
                  ];
                  const color = blueGradients[index] || blueGradients[blueGradients.length - 1];
                  return <Cell key={`cell-${index}`} fill={color} />;
                })}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          </div>

          {/* Top 3 Badges */}
          {data.trendingServices.length > 0 && (
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:mt-4 sm:gap-3 lg:mt-5">
              {data.trendingServices.slice(0, 3).map((service, index) => {
                const blueShades = [
                  { border: "border-sky-400/50", bg: "bg-sky-400/10", badge: "bg-sky-500" },
                  { border: "border-blue-500/50", bg: "bg-blue-500/10", badge: "bg-blue-600" },
                  { border: "border-blue-700/50", bg: "bg-blue-700/10", badge: "bg-blue-800" },
                ];
                const shade = blueShades[index] || blueShades[0];
                return (
                  <div
                    key={service.serviceId}
                    className={`flex min-w-0 max-w-full items-center gap-2 rounded-lg border px-2 py-1.5 sm:px-3 sm:py-2 ${shade.border} ${shade.bg}`}
                  >
                    <div className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold text-[10px] text-white sm:h-6 sm:w-6 sm:text-xs ${shade.badge}`}>
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-white">{service.serviceName}</p>
                      <p className="text-[10px] text-slate-400 sm:text-xs">{service.bookingCount} bookings</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Summary */}
      {data && data.trendingServices.length > 0 && (
        <div className="mt-4 rounded-xl border border-slate-800/80 bg-slate-950/40 px-3 py-3 sm:mt-5 sm:p-4 lg:mt-6">
          <p className="text-xs text-slate-400 sm:text-sm">
            Showing <span className="font-semibold text-slate-300">{data.totalServices}</span> trending services
            {data.period && ` for the last ${data.period}`}
          </p>
        </div>
      )}
    </section>
  );
};

export default TrendingServices;

