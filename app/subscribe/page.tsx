"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { redirectToGateway } from "@/app/utils/gateway";
import {
  DUBAI_AREAS,
  PLAN_ID_TO_TIER,
  PLAN_NAMES,
  PROPERTY_TYPES,
  addOneMonth,
  formatPlanDate,
  isPropertyType,
  listedMonthlyPrice,
  planBenefitSummary,
  type PlanTierName,
  type PropertyTypeId,
} from "@/lib/plans";

type Membership = {
  profile: { fullName: string; email: string; phoneNumber: string | null } | null;
  current: { plan: PlanTierName; planName: string; endsAt: string } | null;
  latest: { plan: PlanTierName; propertyType: string; propertyArea: string } | null;
  renewal: {
    allowed: boolean;
    startsAt: string;
    reason: string | null;
    prices: Partial<Record<PlanTierName, number>>;
  };
};

const OTHER_AREA = "__other__";

function SubscribeContent() {
  const params = useSearchParams();
  const [state, setState] = useState<"loading" | "login" | "ready" | "error">("loading");
  const [membership, setMembership] = useState<Membership | null>(null);
  const [tier, setTier] = useState<PlanTierName>(() => {
    const fromQuery = PLAN_ID_TO_TIER[(params.get("plan") ?? "").toLowerCase() as keyof typeof PLAN_ID_TO_TIER];
    return fromQuery ?? "FIXPRO";
  });
  const [propertyType, setPropertyType] = useState<PropertyTypeId>(() => {
    const p = params.get("property");
    return isPropertyType(p) ? p : "apartment";
  });
  const [areaChoice, setAreaChoice] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [accept, setAccept] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const session = await fetch("/api/auth/session", { credentials: "include", cache: "no-store" });
        if (!session.ok) {
          if (!cancelled) setState("login");
          return;
        }
        const res = await fetch("/api/plans/me", { credentials: "include", cache: "no-store" });
        if (res.status === 401) {
          if (!cancelled) setState("login");
          return;
        }
        if (!res.ok) throw new Error();
        const data = (await res.json()) as Membership;
        if (cancelled) return;
        setMembership(data);
        // Renewing: start from what the customer had, unless the link chose something else.
        if (data.latest) {
          if (!params.get("property") && isPropertyType(data.latest.propertyType)) setPropertyType(data.latest.propertyType);
          const area = data.latest.propertyArea;
          if (DUBAI_AREAS.includes(area)) setAreaChoice(area);
          else {
            setAreaChoice(OTHER_AREA);
            setCustomArea(area);
          }
        }
        setState("ready");
      } catch {
        if (!cancelled) setState("error");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [params]);

  const isFixMax = tier === "FIXMAX";
  const price = isFixMax ? membership?.renewal.prices.FIXMAX ?? null : listedMonthlyPrice(tier, propertyType);
  const area = areaChoice === OTHER_AREA ? customArea.trim() : areaChoice;
  const renewing = Boolean(membership?.current);
  const startsAt = useMemo(
    () => (membership?.renewal.startsAt ? new Date(membership.renewal.startsAt) : new Date()),
    [membership]
  );
  const startsLater = startsAt.getTime() > Date.now() + 60_000;
  const returnPath = `/subscribe?${params.toString()}`;

  const pay = async () => {
    setError(null);
    if (!area) return setError("Please choose your property's area.");
    if (!accept) return setError("Please tick the box to confirm.");
    setSubmitting(true);
    try {
      const res = await fetch("/api/plans/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action: "buy", plan: tier, propertyType, propertyArea: area, accept }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "We couldn't start the payment. Please try again.");
      redirectToGateway(data);
    } catch (err) {
      setError((err as Error).message);
      setSubmitting(false);
    }
  };

  if (state === "loading") {
    return <Centered><div className="size-10 rounded-full border-4 border-white/20 border-t-white animate-spin" /></Centered>;
  }

  if (state === "error") {
    return (
      <Centered>
        <p className="text-white/80">We couldn't load your details. Please refresh the page.</p>
      </Centered>
    );
  }

  if (state === "login") {
    return (
      <Card>
        <h1 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk'] text-white">
          Log in to subscribe to {PLAN_NAMES[tier]}
        </h1>
        <p className="mt-3 text-white/65 text-sm leading-6">
          Your plan is linked to your account so your included visits and member prices apply when you book.
          It takes a minute to create an account, and you'll come straight back here.
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href={`/login?redirect=${encodeURIComponent(returnPath)}`} className={primaryButton}>Log in</Link>
          <Link href={`/signup?redirect=${encodeURIComponent(returnPath)}`} className={secondaryButton}>Create an account</Link>
        </div>
      </Card>
    );
  }

  if (membership && !membership.renewal.allowed) {
    return (
      <Card>
        <h1 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk'] text-white">You already have a plan</h1>
        <p className="mt-3 text-white/65 text-sm leading-6">
          {membership.current
            ? `Your ${membership.current.planName} plan is active until ${formatPlanDate(membership.current.endsAt)}. `
            : ""}
          {membership.renewal.reason}
        </p>
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link href="/my-plan" className={primaryButton}>Go to My Plan</Link>
        </div>
      </Card>
    );
  }

  if (isFixMax && !price) {
    return (
      <Card>
        <h1 className="text-2xl sm:text-3xl font-semibold font-['Space_Grotesk'] text-white">FixMax is priced for your property</h1>
        <p className="mt-3 text-white/65 text-sm leading-6">
          Request a quote and our team will contact you with a price for your property. Once agreed, you'll get a
          secure payment link and your plan starts as soon as you pay.
        </p>
        <div className="mt-6"><Link href="/#plans-pricing" className={primaryButton}>Request a FixMax quote</Link></div>
      </Card>
    );
  }

  const availablePlans: PlanTierName[] = membership?.renewal.prices.FIXMAX ? ["FIXLITE", "FIXPRO", "FIXMAX"] : ["FIXLITE", "FIXPRO"];

  return (
    <Card wide>
      <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.16em]">
        {renewing ? "Pay for next month" : "Subscribe"}
      </p>
      <h1 className="mt-2 text-2xl sm:text-3xl font-semibold font-['Space_Grotesk'] text-white">
        {PLAN_NAMES[tier]} · {price ? `AED ${price.toLocaleString("en-US")}` : "-"} / month
      </h1>

      <div className="mt-6 grid gap-5">
        <Field label="Plan">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            {availablePlans.map((t) => (
              <Choice key={t} active={tier === t} onClick={() => setTier(t)}>
                {PLAN_NAMES[t]}
              </Choice>
            ))}
          </div>
        </Field>

        {!isFixMax && (
          <Field label="Property type">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {PROPERTY_TYPES.map((t) => (
                <Choice key={t.id} active={propertyType === t.id} onClick={() => setPropertyType(t.id)}>
                  {t.label}
                </Choice>
              ))}
            </div>
          </Field>
        )}

        <Field label="Where is the property?">
          <select
            value={areaChoice}
            onChange={(e) => setAreaChoice(e.target.value)}
            className="w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-sky-400 focus:outline-none"
          >
            <option value="">Choose an area</option>
            {DUBAI_AREAS.map((a) => (
              <option key={a} value={a}>{a}</option>
            ))}
            <option value={OTHER_AREA}>Other area</option>
          </select>
          {areaChoice === OTHER_AREA && (
            <input
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              placeholder="Type your area"
              maxLength={120}
              className="mt-2 w-full rounded-xl border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:border-sky-400 focus:outline-none"
            />
          )}
          <p className="mt-2 text-xs text-white/45">
            Your plan covers this property. Bookings for other properties get member prices.
          </p>
        </Field>

        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-white text-sm font-semibold font-['Space_Grotesk']">What's included</p>
          <ul className="mt-2 space-y-1.5 text-[13px] text-white/70 leading-5">
            {planBenefitSummary(tier).map((line) => (
              <li key={line} className="flex gap-2"><span className="text-sky-400">✓</span>{line}</li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-sky-400/20 bg-sky-500/5 p-4 text-sm text-white/80 space-y-1">
          <p>
            <span className="text-white/50">Starts:</span>{" "}
            {startsLater ? `${formatPlanDate(startsAt)} (when your current month ends)` : "today, as soon as you pay"}
          </p>
          <p><span className="text-white/50">Ends:</span> {formatPlanDate(addOneMonth(startsAt))}</p>
          <p><span className="text-white/50">Account:</span> {membership?.profile?.fullName} · {membership?.profile?.email}</p>
        </div>

        <label className="flex items-start gap-3 text-sm text-white/70">
          <input
            type="checkbox"
            checked={accept}
            onChange={(e) => setAccept(e.target.checked)}
            className="mt-0.5 size-4 rounded border-white/30 bg-black/40"
          />
          <span>
            I understand this plan lasts one month and does <strong className="text-white">not</strong> renew
            automatically. To continue, I can pay for the next month from My Plan.
          </span>
        </label>

        {error && (
          <p role="alert" className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">{error}</p>
        )}

        <button onClick={pay} disabled={submitting || !price} className={`${primaryButton} w-full`}>
          {submitting ? "Taking you to secure payment…" : `Pay AED ${price?.toFixed(2) ?? "-"}`}
        </button>
        <p className="text-center text-xs text-white/40">Secure payment by CCAvenue. Your plan is activated as soon as the payment is confirmed.</p>
      </div>
    </Card>
  );
}

const primaryButton =
  "inline-flex items-center justify-center rounded-xl bg-linear-to-b from-sky-400 to-blue-500 px-6 py-3 text-sm font-semibold text-white border border-sky-300/50 hover:from-sky-300 hover:to-blue-400 transition disabled:opacity-60 disabled:cursor-not-allowed";
const secondaryButton =
  "inline-flex items-center justify-center rounded-xl border border-white/25 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition";

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="min-h-[60vh] flex items-center justify-center text-center px-4">{children}</div>;
}

function Card({ children, wide = false }: { children: React.ReactNode; wide?: boolean }) {
  return (
    <div className="min-h-[60vh] flex items-start sm:items-center justify-center px-4 py-10">
      <div className={`w-full ${wide ? "max-w-xl" : "max-w-md"} rounded-3xl border border-white/10 bg-[#0a0f1f] p-6 sm:p-8 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]`}>
        {children}
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-2 text-white/50 text-[11px] font-semibold uppercase tracking-[0.14em]">{label}</p>
      {children}
    </div>
  );
}

function Choice({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-xl px-3 py-2.5 text-sm text-left transition border ${
        active ? "border-sky-400 bg-sky-500/10 text-white" : "border-white/10 bg-white/[0.02] text-white/70 hover:border-white/25"
      }`}
    >
      {children}
    </button>
  );
}

export default function SubscribePage() {
  return (
    <div className="w-full bg-black min-h-screen">
      <div className="pt-20">
        <Header />
        <Suspense fallback={<Centered><div className="size-10 rounded-full border-4 border-white/20 border-t-white animate-spin" /></Centered>}>
          <SubscribeContent />
        </Suspense>
        <Footer />
      </div>
    </div>
  );
}
