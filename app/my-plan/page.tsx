"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { redirectToGateway } from "@/app/utils/gateway";
import { PLAN_NAMES, TIME_SLOTS, dubaiToday, formatPlanDate, type PlanTierName } from "@/lib/plans";

type Period = {
  id: string;
  code: string;
  plan: PlanTierName;
  planName: string;
  propertyType: string;
  propertyLabel: string;
  propertyArea: string;
  price: string;
  startsAt: string;
  endsAt: string;
  state: "ACTIVE" | "UPCOMING" | "ENDED" | "CANCELLED";
};

type Membership = {
  current: (Period & { visitsAllowed: number | null; visitsUsed: number; benefits: string[] }) | null;
  upcoming: Period[];
  coverageEndsAt: string | null;
  latest: Period | null;
  renewal: {
    allowed: boolean;
    opensAt: string | null;
    reason: string | null;
    prices: Partial<Record<PlanTierName, number>>;
    propertyType: string;
  };
  upgrade: { available: boolean; amount: number | null; reason: string | null } | null;
  preventiveCheck: { available: boolean; eligible: boolean; nextAvailableAt: string | null; reason: string | null };
  history: Period[];
};

const STATE_LABEL: Record<Period["state"], string> = {
  ACTIVE: "Active",
  UPCOMING: "Paid, starts later",
  ENDED: "Ended",
  CANCELLED: "Cancelled",
};

const planId = (tier: PlanTierName) => tier.toLowerCase();

export default function MyPlanPage() {
  const [state, setState] = useState<"loading" | "login" | "ready" | "error">("loading");
  const [data, setData] = useState<Membership | null>(null);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeError, setUpgradeError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/plans/me", { credentials: "include", cache: "no-store" });
      if (res.status === 401) return setState("login");
      if (!res.ok) throw new Error();
      setData(await res.json());
      setState("ready");
    } catch {
      setState("error");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Scroll to the upgrade box when coming from "Upgrade to FixPro" on the plans section.
  useEffect(() => {
    if (state === "ready" && window.location.hash === "#upgrade") {
      document.getElementById("upgrade")?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [state]);

  const upgrade = async () => {
    if (!data?.upgrade?.amount) return;
    if (!window.confirm(`Upgrade to FixPro now for AED ${data.upgrade.amount.toFixed(2)}? Your end date stays the same.`)) return;
    setUpgrading(true);
    setUpgradeError(null);
    try {
      const res = await fetch("/api/plans/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "upgrade" }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message ?? "We couldn't start the upgrade. Please try again.");
      redirectToGateway(body);
    } catch (err) {
      setUpgradeError((err as Error).message);
      setUpgrading(false);
    }
  };

  return (
    <div className="w-full bg-black min-h-screen">
      <div className="pt-20">
        <Header />
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-14 text-white space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-['Space_Grotesk']">My Plan</h1>

          {state === "loading" && (
            <div className="min-h-[40vh] flex items-center justify-center">
              <div className="size-10 rounded-full border-4 border-white/20 border-t-white animate-spin" />
            </div>
          )}

          {state === "error" && <Box>We couldn't load your plan. Please refresh the page.</Box>}

          {state === "login" && (
            <Box>
              <p className="text-white/70 text-sm">Log in to see your plan.</p>
              <Link href="/login?redirect=%2Fmy-plan" className={`${primaryButton} mt-4`}>Log in</Link>
            </Box>
          )}

          {state === "ready" && data && (
            <>
              {data.current ? (
                <CurrentPlan data={data} />
              ) : (
                <NoPlan data={data} />
              )}

              {data.current && (
                <Box>
                  <h2 className={sectionTitle}>Next month</h2>
                  {data.upcoming.length > 0 ? (
                    <p className="text-sm text-white/70">
                      Next month is paid: {data.upcoming.map((p) => `${p.planName} from ${formatPlanDate(p.startsAt)}`).join(", ")}.
                      Your plan now runs until {formatPlanDate(data.coverageEndsAt)}.
                    </p>
                  ) : data.renewal.allowed ? (
                    <>
                      <p className="text-sm text-white/70">
                        Your plan ends on {formatPlanDate(data.current.endsAt)} and does not renew automatically. Pay now
                        to continue. The new month starts when this one ends, so you won't lose any days.
                      </p>
                      <Link
                        href={`/subscribe?plan=${planId(data.current.plan)}&property=${data.current.propertyType}`}
                        className={`${primaryButton} mt-4`}
                      >
                        Pay for next month
                      </Link>
                    </>
                  ) : (
                    <p className="text-sm text-white/70">
                      Your plan ends on {formatPlanDate(data.current.endsAt)} and does not renew automatically.{" "}
                      {data.renewal.reason} We'll email you a reminder.
                    </p>
                  )}
                </Box>
              )}

              {data.upgrade && (
                <div id="upgrade">
                  <Box>
                    <h2 className={sectionTitle}>Upgrade to FixPro</h2>
                    {data.upgrade.available ? (
                      <>
                        <p className="text-sm text-white/70">
                          Get unlimited included visits, emergency cover and quarterly preventive checks straight away.
                          You only pay the difference for the days left this month: <strong className="text-white">AED {data.upgrade.amount?.toFixed(2)}</strong>.
                          Your end date stays the same.
                        </p>
                        {upgradeError && <p className="mt-3 text-sm text-red-300">{upgradeError}</p>}
                        <button onClick={upgrade} disabled={upgrading} className={`${primaryButton} mt-4`}>
                          {upgrading ? "Taking you to secure payment…" : `Upgrade for AED ${data.upgrade.amount?.toFixed(2)}`}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-white/70">{data.upgrade.reason}</p>
                    )}
                  </Box>
                </div>
              )}

              {data.preventiveCheck.available && (
                <PreventiveCheck data={data} onBooked={load} />
              )}

              {data.history.length > 0 && <History periods={data.history} />}
            </>
          )}
        </main>
        <Footer />
      </div>
    </div>
  );
}

function CurrentPlan({ data }: { data: Membership }) {
  const c = data.current!;
  const visitsLeft = c.visitsAllowed === null ? null : Math.max(0, c.visitsAllowed - c.visitsUsed);
  return (
    <div className="rounded-3xl border border-sky-500/40 bg-linear-to-b from-sky-900/40 to-gray-950/60 p-6 sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full bg-emerald-500/15 px-3 py-1 text-xs font-semibold text-emerald-300 ring-1 ring-emerald-500/30">
            Active
          </span>
          <h2 className="mt-3 text-3xl font-semibold font-['Space_Grotesk']">{c.planName}</h2>
          <p className="text-sm text-white/60">{c.propertyLabel} · {c.propertyArea}</p>
        </div>
        <div className="text-right text-sm">
          <p className="text-white/50">Active until</p>
          <p className="text-lg font-semibold">{formatPlanDate(c.endsAt)}</p>
          <p className="mt-1 text-xs text-white/40 font-mono">{c.code}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-4">
        <p className="text-sm text-white/60">Included repair visits this month</p>
        <p className="mt-1 text-xl font-semibold font-['Space_Grotesk']">
          {visitsLeft === null ? "Unlimited" : `${visitsLeft} of ${c.visitsAllowed} left`}
        </p>
        {visitsLeft === 0 && (
          <p className="mt-1 text-xs text-white/50">You still get member prices on every booking.</p>
        )}
      </div>

      <ul className="mt-5 space-y-1.5 text-[13px] text-white/75 leading-5">
        {c.benefits.map((line) => (
          <li key={line} className="flex gap-2"><span className="text-sky-400">✓</span>{line}</li>
        ))}
      </ul>

      <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm text-white/70">
        <p className="font-semibold text-white">How to use your plan</p>
        <p className="mt-1">
          Book any service as usual. At checkout, included services on your plan property show <strong className="text-white">AED 0</strong>,
          and everything else shows your member price. If all items are included, you just confirm the booking; no payment needed.
        </p>
        <Link href="/services" className={`${primaryButton} mt-4`}>Book a service</Link>
      </div>
    </div>
  );
}

function NoPlan({ data }: { data: Membership }) {
  const latest = data.latest;
  const upcoming = data.upcoming[0];
  return (
    <Box>
      {upcoming ? (
        <p className="text-sm text-white/70">
          Your {upcoming.planName} plan starts on {formatPlanDate(upcoming.startsAt)}.
        </p>
      ) : (
        <>
          <h2 className={sectionTitle}>You don't have an active plan</h2>
          <p className="text-sm text-white/70">
            {latest && latest.state !== "ACTIVE"
              ? `Your ${latest.planName} plan ${latest.state === "CANCELLED" ? "was cancelled" : `ended on ${formatPlanDate(latest.endsAt)}`}. You can start a new month at any time.`
              : "A plan gives you included repair visits and member prices on every service."}
          </p>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            {latest && latest.plan !== "FIXMAX" && (
              <Link href={`/subscribe?plan=${planId(latest.plan)}&property=${latest.propertyType}`} className={primaryButton}>
                Restart {latest.planName}
              </Link>
            )}
            <Link href="/#plans-pricing" className={secondaryButton}>See all plans</Link>
          </div>
        </>
      )}
    </Box>
  );
}

function PreventiveCheck({ data, onBooked }: { data: Membership; onBooked: () => void }) {
  const [date, setDate] = useState("");
  const [slot, setSlot] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);
  const maxDate = data.coverageEndsAt
    ? new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Dubai" }).format(new Date(new Date(data.coverageEndsAt).getTime() - 86400000))
    : undefined;

  const book = async () => {
    setMessage(null);
    if (!date || !slot) return setMessage({ ok: false, text: "Please choose a date and time." });
    setBusy(true);
    try {
      const res = await fetch("/api/plans/preventive-check", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ date, timeSlot: slot }),
      });
      const body = await res.json().catch(() => null);
      if (!res.ok) throw new Error(body?.message ?? "We couldn't book your check. Please try again.");
      setMessage({ ok: true, text: `Booked! Your booking ID is ${body.bookingCode}. You'll find it in My Bookings.` });
      onBooked();
    } catch (err) {
      setMessage({ ok: false, text: (err as Error).message });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Box>
      <h2 className={sectionTitle}>Quarterly preventive check</h2>
      {data.preventiveCheck.eligible ? (
        <>
          <p className="text-sm text-white/70">
            Included in your plan once every 3 months, at your plan property ({data.current?.propertyArea}).
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
            <input
              type="date"
              value={date}
              min={dubaiToday()}
              max={maxDate}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none [color-scheme:dark]"
            />
            <select
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
              className="rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
            >
              <option value="">Choose a time</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <button onClick={book} disabled={busy} className={primaryButton}>{busy ? "Booking…" : "Book check"}</button>
          </div>
        </>
      ) : (
        <p className="text-sm text-white/70">{data.preventiveCheck.reason}</p>
      )}
      {message && (
        <p className={`mt-3 text-sm ${message.ok ? "text-emerald-300" : "text-red-300"}`}>{message.text}</p>
      )}
    </Box>
  );
}

function History({ periods }: { periods: Period[] }) {
  return (
    <Box>
      <h2 className={sectionTitle}>Plan history</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-xs uppercase tracking-wide text-white/40">
            <tr>
              <th className="py-2 pr-4">Plan ID</th>
              <th className="py-2 pr-4">Plan</th>
              <th className="py-2 pr-4">Dates</th>
              <th className="py-2 pr-4">Price</th>
              <th className="py-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {periods.map((p) => (
              <tr key={p.id}>
                <td className="py-2.5 pr-4 font-mono text-xs text-white/70">{p.code}</td>
                <td className="py-2.5 pr-4">{PLAN_NAMES[p.plan]} · {p.propertyLabel}</td>
                <td className="py-2.5 pr-4 whitespace-nowrap text-white/70">{formatPlanDate(p.startsAt)} – {formatPlanDate(p.endsAt)}</td>
                <td className="py-2.5 pr-4 whitespace-nowrap">AED {p.price}</td>
                <td className="py-2.5 text-white/70">{STATE_LABEL[p.state]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Box>
  );
}

function Box({ children }: { children: React.ReactNode }) {
  return <section className="rounded-3xl border border-white/10 bg-[#0d1117] p-6 sm:p-8">{children}</section>;
}

const sectionTitle = "text-lg font-semibold font-['Space_Grotesk'] mb-2";
const primaryButton =
  "inline-flex items-center justify-center rounded-xl bg-linear-to-b from-sky-400 to-blue-500 px-5 py-3 text-sm font-semibold text-white border border-sky-300/50 hover:from-sky-300 hover:to-blue-400 transition disabled:opacity-60 disabled:cursor-not-allowed";
const secondaryButton =
  "inline-flex items-center justify-center rounded-xl border border-white/25 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10 transition";
