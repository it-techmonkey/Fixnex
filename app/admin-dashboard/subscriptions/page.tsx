'use client';

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import {
  DUBAI_AREAS,
  PLAN_NAMES,
  PROPERTY_TYPES,
  formatPlanDate,
  listedMonthlyPrice,
  type PlanTierName,
  type PropertyTypeId,
} from "@/lib/plans";

type Row = {
  id: string;
  code: string;
  plan: PlanTierName;
  planName: string;
  propertyLabel: string;
  propertyArea: string;
  price: string;
  startsAt: string;
  endsAt: string;
  state: "ACTIVE" | "UPCOMING" | "ENDED" | "CANCELLED";
  source: string;
  visitsAllowed: number | null;
  visitsUsed: number | null;
  visitsBonus: number;
  renewed: boolean;
  adminNote: string | null;
  user: { id: string; fullName: string; email: string; phoneNumber: string | null; customer_code: string | null };
};

type Stats = { active: Record<PlanTierName, number>; endingThisWeek: number; revenueLast30Days: number };

const VIEWS = [
  { key: "active", label: "Active" },
  { key: "ending", label: "Ending this week" },
  { key: "upcoming", label: "Paid for later" },
  { key: "ended", label: "Ended" },
  { key: "cancelled", label: "Cancelled" },
  { key: "all", label: "All" },
] as const;

const PLAN_STYLES: Record<PlanTierName, string> = {
  FIXLITE: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  FIXPRO: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  FIXMAX: "bg-violet-500/15 text-violet-300 ring-violet-500/30",
};

const STATE_LABEL: Record<Row["state"], string> = {
  ACTIVE: "Active",
  UPCOMING: "Starts later",
  ENDED: "Ended",
  CANCELLED: "Cancelled",
};

function SubscriptionsContent() {
  const params = useSearchParams();
  const [view, setView] = useState<(typeof VIEWS)[number]["key"]>("active");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<Row[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(params.get("create") === "1");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const q = new URLSearchParams({ view });
      if (search.trim()) q.set("search", search.trim());
      const res = await fetch(`/api/admin/subscriptions?${q}`, { cache: "no-store", credentials: "include" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Failed to load subscriptions.");
      setRows(data.subscriptions);
      setStats(data.stats);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [view, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const act = async (row: Row, action: string, extra: Record<string, unknown> = {}) => {
    setBusyId(row.id);
    try {
      const res = await fetch(`/api/admin/subscriptions/${row.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ action, ...extra }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Action failed.");
      await load();
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setBusyId(null);
    }
  };

  const extend = (row: Row) => {
    const value = window.prompt(`Extend ${row.user.fullName}'s ${row.planName} plan by how many days? (1–90)`, "7");
    if (!value) return;
    act(row, "extend", { days: Number(value) });
  };

  const cancel = (row: Row) => {
    if (!window.confirm(`Cancel ${row.user.fullName}'s ${row.planName} plan now? Member prices and included visits stop immediately. Refunds are handled separately.`)) return;
    act(row, "cancel");
  };

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {(["FIXLITE", "FIXPRO", "FIXMAX"] as PlanTierName[]).map((p) => (
            <StatCard key={p} label={`Active ${PLAN_NAMES[p]}`} value={stats.active[p] ?? 0} />
          ))}
          <StatCard label="Ending this week" value={stats.endingThisWeek} />
          <StatCard label="Plan payments (30 days)" value={`AED ${stats.revenueLast30Days.toLocaleString("en-US")}`} />
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {VIEWS.map((v) => (
            <button
              key={v.key}
              onClick={() => setView(v.key)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
                view === v.key ? "bg-sky-500/15 text-sky-300 ring-sky-500/40" : "text-slate-400 ring-slate-700 hover:text-white"
              }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <button
          onClick={() => setShowCreate(true)}
          className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400"
        >
          + Create plan for a customer
        </button>
      </div>

      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search by name, email, customer ID, plan ID or area"
        className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none sm:max-w-md"
      />

      {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

      <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
        <table className="min-w-full divide-y divide-slate-800 text-sm">
          <thead className="bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Plan</th>
              <th className="px-4 py-3">Property</th>
              <th className="px-4 py-3">Dates</th>
              <th className="px-4 py-3">Visits</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {loading && <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">Loading…</td></tr>}
            {!loading && rows.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-500">No plans in this view.</td></tr>
            )}
            {!loading &&
              rows.map((r) => (
                <tr key={r.id} className="align-top hover:bg-slate-900/60">
                  <td className="px-4 py-3">
                    <p className="font-medium text-white">{r.user.fullName}</p>
                    <p className="text-xs text-slate-400">{r.user.customer_code ?? "-"} · {r.user.email}</p>
                    {r.user.phoneNumber && <p className="text-xs text-slate-500">{r.user.phoneNumber}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ${PLAN_STYLES[r.plan]}`}>
                      {r.planName}
                    </span>
                    <p className="mt-1 font-mono text-[11px] text-slate-500">{r.code}</p>
                    <p className="text-[11px] text-slate-500">
                      {STATE_LABEL[r.state]}
                      {r.renewed && r.state !== "CANCELLED" ? " · next month paid" : ""}
                      {r.source !== "online" ? ` · via ${r.source === "admin" ? "admin" : "payment link"}` : ""}
                    </p>
                  </td>
                  <td className="px-4 py-3 text-slate-300">
                    {r.propertyLabel}
                    <p className="text-xs text-slate-500">{r.propertyArea}</p>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {formatPlanDate(r.startsAt)} – {formatPlanDate(r.endsAt)}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-300">
                    {r.visitsAllowed === null ? "Unlimited" : `${r.visitsUsed ?? 0} of ${r.visitsAllowed} used`}
                    {r.visitsBonus > 0 && <p className="text-xs text-slate-500">incl. {r.visitsBonus} extra</p>}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-slate-200">AED {r.price}</td>
                  <td className="px-4 py-3">
                    {r.state === "CANCELLED" ? (
                      <span className="text-xs text-slate-500">-</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        <ActionButton disabled={busyId === r.id} onClick={() => extend(r)}>Extend</ActionButton>
                        {r.visitsAllowed !== null && (
                          <>
                            <ActionButton disabled={busyId === r.id} onClick={() => act(r, "add_visit")}>+1 visit</ActionButton>
                            {r.visitsBonus > 0 && (
                              <ActionButton disabled={busyId === r.id} onClick={() => act(r, "remove_visit")}>−1 visit</ActionButton>
                            )}
                          </>
                        )}
                        <ActionButton danger disabled={busyId === r.id} onClick={() => cancel(r)}>Cancel</ActionButton>
                      </div>
                    )}
                    {r.adminNote && <p className="mt-2 max-w-[220px] whitespace-pre-wrap text-[11px] text-slate-500">{r.adminNote}</p>}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>

      {showCreate && (
        <CreatePlanModal
          initialEmail={params.get("email") ?? ""}
          initialPlan={(params.get("plan") as PlanTierName) ?? "FIXMAX"}
          onClose={() => setShowCreate(false)}
          onCreated={load}
        />
      )}
    </div>
  );
}

function CreatePlanModal({
  initialEmail,
  initialPlan,
  onClose,
  onCreated,
}: {
  initialEmail: string;
  initialPlan: PlanTierName;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [email, setEmail] = useState(initialEmail);
  const [plan, setPlan] = useState<PlanTierName>(initialPlan in PLAN_NAMES ? initialPlan : "FIXMAX");
  const [propertyType, setPropertyType] = useState<PropertyTypeId>("villa");
  const [area, setArea] = useState("");
  const [price, setPrice] = useState("");
  const [mode, setMode] = useState<"link" | "activate">("link");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [linkUrl, setLinkUrl] = useState<string | null>(null);

  // Fill in the listed price for FixLite / FixPro; FixMax is typed in from the quote.
  useEffect(() => {
    const listed = listedMonthlyPrice(plan, propertyType);
    if (listed) setPrice(String(listed));
  }, [plan, propertyType]);

  const submit = async () => {
    setError(null);
    setBusy(true);
    try {
      const res = await fetch("/api/admin/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, plan, propertyType, propertyArea: area, price, mode, note }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Failed to create the plan.");
      onCreated();
      if (data.link) setLinkUrl(`${window.location.origin}/pay/${data.link.id}`);
      else onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const input = "w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white focus:border-sky-500 focus:outline-none";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-start justify-between">
          <h2 className="text-lg font-semibold text-white">Create a plan for a customer</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white" aria-label="Close">✕</button>
        </div>

        {linkUrl ? (
          <div className="mt-5 space-y-4">
            <p className="text-sm text-slate-300">
              Payment link created. Send it to the customer. Their plan starts as soon as they pay, and you&apos;ll see it here.
            </p>
            <div className="flex gap-2">
              <input readOnly value={linkUrl} className={input} onFocus={(e) => e.target.select()} />
              <button
                onClick={() => navigator.clipboard?.writeText(linkUrl)}
                className="shrink-0 rounded-xl bg-sky-500 px-4 text-sm font-semibold text-slate-950 hover:bg-sky-400"
              >
                Copy
              </button>
            </div>
            <p className="text-xs text-slate-500">It&apos;s also listed on the Payment Links page.</p>
            <button onClick={onClose} className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-white hover:bg-slate-800">Done</button>
          </div>
        ) : (
          <div className="mt-5 space-y-4 text-sm">
            <Label text="Customer's account email">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="customer@example.com" className={input} />
              <span className="mt-1 block text-xs text-slate-500">The customer needs a Fixnex account. If they don&apos;t have one, ask them to sign up first.</span>
            </Label>
            <div className="grid grid-cols-2 gap-3">
              <Label text="Plan">
                <select value={plan} onChange={(e) => setPlan(e.target.value as PlanTierName)} className={input}>
                  {(Object.keys(PLAN_NAMES) as PlanTierName[]).map((p) => <option key={p} value={p}>{PLAN_NAMES[p]}</option>)}
                </select>
              </Label>
              <Label text="Property type">
                <select value={propertyType} onChange={(e) => setPropertyType(e.target.value as PropertyTypeId)} className={input}>
                  {PROPERTY_TYPES.map((t) => <option key={t.id} value={t.id}>{t.label}</option>)}
                </select>
              </Label>
            </div>
            <Label text="Area">
              <input list="plan-areas" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Jumeirah" className={input} />
              <datalist id="plan-areas">{DUBAI_AREAS.map((a) => <option key={a} value={a} />)}</datalist>
            </Label>
            <Label text="Monthly price (AED)">
              <input type="number" min={1} step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} className={input} />
            </Label>
            <Label text="How will they pay?">
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-slate-300">
                  <input type="radio" checked={mode === "link"} onChange={() => setMode("link")} className="mt-1" />
                  <span>Send a payment link <span className="text-slate-500">(recommended; the plan starts when they pay)</span></span>
                </label>
                <label className="flex items-start gap-2 text-slate-300">
                  <input type="radio" checked={mode === "activate"} onChange={() => setMode("activate")} className="mt-1" />
                  <span>Already paid another way: activate now</span>
                </label>
              </div>
            </Label>
            <Label text="Note (optional)">
              <input value={note} onChange={(e) => setNote(e.target.value)} placeholder="e.g. Quote agreed by phone on 2 Nov" className={input} />
            </Label>
            {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-rose-300">{error}</p>}
            <button
              onClick={submit}
              disabled={busy}
              className="w-full rounded-xl bg-sky-500 px-4 py-2.5 font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60"
            >
              {busy ? "Creating…" : mode === "link" ? "Create payment link" : "Activate plan now"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Label({ text, children }: { text: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-400">{text}</span>
      {children}
    </label>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-1 text-xl font-semibold text-white">{value}</p>
    </div>
  );
}

function ActionButton({
  children,
  onClick,
  disabled,
  danger = false,
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg border px-2.5 py-1 text-xs font-medium transition disabled:opacity-50 ${
        danger
          ? "border-rose-500/40 text-rose-300 hover:bg-rose-500/10"
          : "border-sky-500/30 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20"
      }`}
    >
      {children}
    </button>
  );
}

export default function SubscriptionsPage() {
  return (
    <AdminLayout title="Subscriptions" currentNav="subscriptions">
      <Suspense fallback={<p className="text-slate-400">Loading…</p>}>
        <SubscriptionsContent />
      </Suspense>
    </AdminLayout>
  );
}
