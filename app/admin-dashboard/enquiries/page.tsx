'use client';

import { useCallback, useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";

type EnquiryStatus = "NEW" | "CONTACTED" | "CONVERTED" | "CLOSED";

type Enquiry = {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan_name: string;
  type: string;
  property_label: string | null;
  price: string | null;
  facilities: string[];
  message: string | null;
  status: EnquiryStatus;
  admin_note: string | null;
  email_sent: boolean;
  created_at: string;
  user: { customer_code: string | null } | null;
};

const STATUS_LABELS: Record<EnquiryStatus, string> = {
  NEW: "New",
  CONTACTED: "Contacted",
  CONVERTED: "Converted",
  CLOSED: "Closed",
};

const STATUS_STYLES: Record<EnquiryStatus, string> = {
  NEW: "bg-amber-500/15 text-amber-300 ring-amber-500/30",
  CONTACTED: "bg-sky-500/15 text-sky-300 ring-sky-500/30",
  CONVERTED: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/30",
  CLOSED: "bg-slate-500/15 text-slate-300 ring-slate-500/30",
};

const formatDate = (value: string) =>
  new Date(value).toLocaleString("en-GB", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Dubai" });

export default function EnquiriesPage() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [counts, setCounts] = useState<Record<EnquiryStatus, number>>({ NEW: 0, CONTACTED: 0, CONVERTED: 0, CLOSED: 0 });
  const [statusFilter, setStatusFilter] = useState<"" | EnquiryStatus>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<Enquiry | null>(null);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (statusFilter) params.set("status", statusFilter);
      if (search.trim()) params.set("search", search.trim());
      const res = await fetch(`/api/admin/enquiries?${params}`, { cache: "no-store", credentials: "include" });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Failed to load enquiries.");
      setEnquiries(data.enquiries);
      setCounts(data.counts);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, search]);

  useEffect(() => {
    const timer = setTimeout(load, 250);
    return () => clearTimeout(timer);
  }, [load]);

  const update = async (enquiry: Enquiry, changes: { status?: EnquiryStatus; adminNote?: string }) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/enquiries/${enquiry.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(changes),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.message ?? "Failed to update enquiry.");
      const updated = { ...enquiry, ...data.enquiry, user: enquiry.user } as Enquiry;
      setEnquiries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
      if (changes.status && changes.status !== enquiry.status) {
        setCounts((prev) => ({ ...prev, [enquiry.status]: prev[enquiry.status] - 1, [changes.status!]: prev[changes.status!] + 1 }));
      }
      setSelected((prev) => (prev?.id === updated.id ? updated : prev));
    } catch (err) {
      alert((err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  const openEnquiry = (enquiry: Enquiry) => {
    setSelected(enquiry);
    setNote(enquiry.admin_note ?? "");
  };

  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return (
    <AdminLayout title="Enquiries" currentNav="enquiries">
      <div className="space-y-6">
        <p className="text-sm text-slate-400">
          Every plan enquiry and quote request from the website. Update the status as you follow up.
        </p>

        <div className="flex flex-wrap gap-2">
          <FilterChip active={statusFilter === ""} onClick={() => setStatusFilter("")} label={`All (${total})`} />
          {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((s) => (
            <FilterChip
              key={s}
              active={statusFilter === s}
              onClick={() => setStatusFilter(s)}
              label={`${STATUS_LABELS[s]} (${counts[s] ?? 0})`}
            />
          ))}
        </div>

        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, plan or property"
          className="w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none sm:max-w-md"
        />

        {error && <p className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">{error}</p>}

        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/40">
          <table className="min-w-full divide-y divide-slate-800 text-sm">
            <thead className="bg-slate-900/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Plan</th>
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70">
              {loading && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">Loading…</td></tr>
              )}
              {!loading && enquiries.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-500">No enquiries found.</td></tr>
              )}
              {!loading &&
                enquiries.map((e) => (
                  <tr key={e.id} className="hover:bg-slate-900/60">
                    <td className="whitespace-nowrap px-4 py-3 text-slate-400">{formatDate(e.created_at)}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{e.name}</p>
                      <p className="text-xs text-slate-400">{e.phone} · {e.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-slate-200">
                      {e.plan_name}
                      <span className="ml-1 text-xs text-slate-500">{e.type === "enquiry" ? "quote" : "subscription"}</span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{e.property_label ?? "-"}</td>
                    <td className="px-4 py-3">
                      <select
                        value={e.status}
                        disabled={saving}
                        onChange={(ev) => update(e, { status: ev.target.value as EnquiryStatus })}
                        className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ring-inset focus:outline-none ${STATUS_STYLES[e.status]} bg-slate-950`}
                      >
                        {(Object.keys(STATUS_LABELS) as EnquiryStatus[]).map((s) => (
                          <option key={s} value={s}>{STATUS_LABELS[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => openEnquiry(e)}
                        className="rounded-lg border border-sky-500/30 bg-sky-500/10 px-3 py-1.5 text-xs font-medium text-sky-300 hover:bg-sky-500/20"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={() => setSelected(null)}>
          <div
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-700 bg-slate-950 p-6"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-white">{selected.name}</h2>
                <p className="text-xs text-slate-400">{formatDate(selected.created_at)}</p>
              </div>
              <button onClick={() => setSelected(null)} className="text-slate-400 hover:text-white" aria-label="Close">✕</button>
            </div>

            <dl className="mt-5 space-y-3 text-sm">
              <Row label="Phone"><a href={`tel:${selected.phone}`} className="text-sky-300">{selected.phone}</a></Row>
              <Row label="Email"><a href={`mailto:${selected.email}`} className="text-sky-300 break-all">{selected.email}</a></Row>
              {selected.user?.customer_code && <Row label="Customer ID">{selected.user.customer_code}</Row>}
              <Row label="Plan">{selected.plan_name} ({selected.type === "enquiry" ? "quote request" : "subscription"})</Row>
              <Row label="Property">{selected.property_label ?? "-"}</Row>
              {selected.price && <Row label="Price shown">AED {selected.price} / month</Row>}
              {selected.type === "enquiry" && (
                <Row label="Facilities">{selected.facilities.length ? selected.facilities.join(", ") : "None selected"}</Row>
              )}
              {selected.message && <Row label="Message"><span className="whitespace-pre-wrap">{selected.message}</span></Row>}
              <Row label="Email to team">{selected.email_sent ? "Sent" : "Not sent (saved here only)"}</Row>
            </dl>

            <label className="mt-5 block text-xs font-semibold uppercase tracking-wide text-slate-400">
              Internal note
              <textarea
                value={note}
                onChange={(ev) => setNote(ev.target.value)}
                rows={3}
                placeholder="e.g. Called on 2 Nov, quoted AED 1,200 / month"
                className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-sm normal-case tracking-normal text-white focus:border-sky-500 focus:outline-none"
              />
            </label>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                disabled={saving}
                onClick={() => update(selected, { adminNote: note })}
                className="rounded-xl bg-sky-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-sky-400 disabled:opacity-60"
              >
                {saving ? "Saving…" : "Save note"}
              </button>
              {selected.type === "enquiry" && (
                <a
                  href={`/admin-dashboard/subscriptions?create=1&email=${encodeURIComponent(selected.email)}&plan=FIXMAX`}
                  className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-300 hover:bg-emerald-500/20"
                >
                  Create FixMax plan
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}

function FilterChip({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-xs font-medium ring-1 ring-inset transition ${
        active ? "bg-sky-500/15 text-sky-300 ring-sky-500/40" : "text-slate-400 ring-slate-700 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-[110px_1fr] gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-slate-200">{children}</dd>
    </div>
  );
}
