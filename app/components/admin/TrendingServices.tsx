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
    <section className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 sm:p-6 shadow-lg">
      {/* Header */}
      <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-semibold text-white">Trending Services</h2>
          {data && (
            <p className="mt-1 text-xs sm:text-sm text-slate-400">
              {formatDate(data.startDate)} - {formatDate(data.endDate)}
            </p>
          )}
        </div>

        {/* Period Filter */}
        <div className="flex gap-2 flex-wrap">
          {periodOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setPeriod(option.value)}
              disabled={loading}
              className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
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
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={`skeleton-${index}`}
              className="animate-pulse rounded-lg border border-slate-800 bg-slate-900/50 p-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-slate-800/60" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-3/4 rounded bg-slate-800/60" />
                  <div className="h-3 w-1/2 rounded bg-slate-800/60" />
                </div>
                <div className="h-6 w-16 rounded bg-slate-800/60" />
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-center">
          <p className="text-sm text-rose-100">{error}</p>
          <button
            type="button"
            onClick={() => fetchTrendingServices(period)}
            className="mt-3 rounded-lg border border-rose-200/30 px-3 py-1.5 text-xs font-semibold text-rose-50 transition hover:border-rose-50 hover:text-white"
          >
            Retry
          </button>
        </div>
      ) : !data || data.trendingServices.length === 0 ? (
        <div className="rounded-lg border border-slate-800 bg-slate-900/50 p-8 text-center">
          <p className="text-sm text-slate-400">No trending services found for this period</p>
        </div>
      ) : (
        <div className="w-full">
          <ResponsiveContainer width="100%" height={500}>
            <BarChart
              data={data.trendingServices.slice(0, 10).map((service, index) => ({
                name: service.serviceName.length > 15 ? `${service.serviceName.substring(0, 15)}...` : service.serviceName,
                fullName: service.serviceName,
                category: service.categoryName,
                bookings: service.bookingCount,
                uniqueBookings: service.uniqueBookingCount,
                rank: index + 1,
              }))}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <XAxis
                dataKey="name"
                angle={-45}
                textAnchor="end"
                height={100}
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 11 }}
              />
              <YAxis
                stroke="#94a3b8"
                tick={{ fill: '#94a3b8', fontSize: 12 }}
                label={{ value: 'Bookings', angle: -90, position: 'insideLeft', fill: '#94a3b8', fontSize: 12 }}
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

          {/* Top 3 Badges */}
          {data.trendingServices.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-3 justify-center">
              {data.trendingServices.slice(0, 3).map((service, index) => {
                const blueShades = [
                  { border: "border-sky-400/50", bg: "bg-sky-400/10", badge: "bg-sky-500" }, // Light blue
                  { border: "border-blue-500/50", bg: "bg-blue-500/10", badge: "bg-blue-600" }, // Medium blue
                  { border: "border-blue-700/50", bg: "bg-blue-700/10", badge: "bg-blue-800" }, // Dark blue
                ];
                const shade = blueShades[index] || blueShades[0];
                return (
                  <div
                    key={service.serviceId}
                    className={`flex items-center gap-2 rounded-lg border px-3 py-2 ${shade.border} ${shade.bg}`}
                  >
                    <div
                      className={`flex h-6 w-6 items-center justify-center rounded-full font-bold text-xs text-white ${shade.badge}`}
                    >
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-white">{service.serviceName}</p>
                      <p className="text-xs text-slate-400">{service.bookingCount} bookings</p>
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
        <div className="mt-6 rounded-lg border border-slate-800 bg-slate-950/40 p-4">
          <p className="text-xs text-slate-400">
            Showing <span className="font-semibold text-slate-300">{data.totalServices}</span> trending services
            {data.period && ` for the last ${data.period}`}
          </p>
        </div>
      )}
    </section>
  );
};

export default TrendingServices;

