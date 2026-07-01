"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";
import { LinkIcon, CopyIcon, PlusIcon, CheckIcon } from "lucide-react";

type CustomPaymentLink = {
  id: string;
  amount: string;
  description: string;
  customer_email: string | null;
  status: string;
  created_at: string;
};

export default function PaymentLinksPage() {
  const [links, setLinks] = useState<CustomPaymentLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form State
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLinks();
  }, []);

  const fetchLinks = async () => {
    try {
      const res = await fetch("/api/admin/payment-links");
      const data = await res.json();
      setLinks(data.links || []);
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/payment-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, description, customer_email: email }),
      });

      if (!res.ok) throw new Error("Failed to create link");

      await fetchLinks();
      setIsModalOpen(false);
      setAmount("");
      setDescription("");
      setEmail("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (id: string) => {
    const url = `${window.location.origin}/pay/${id}`;
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AdminLayout title="Payment Links" currentNav="payment-links">
      <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white sm:text-2xl">Custom Payment Links</h2>
            <p className="mt-1 text-sm text-slate-400">Generate secure payment URLs for custom amounts.</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-sky-500 to-indigo-500 px-4 py-2.5 text-sm font-medium text-white shadow-lg transition hover:opacity-90"
          >
            <PlusIcon className="size-4" />
            Create New Link
          </button>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/50 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-800 text-sm text-left">
              <thead className="bg-slate-900/80 text-xs font-semibold uppercase tracking-wide text-slate-400">
                <tr>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Customer Email</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-900/80">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">Loading...</td>
                  </tr>
                ) : links.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-slate-400">No payment links created yet.</td>
                  </tr>
                ) : (
                  links.map((link) => (
                    <tr key={link.id} className="transition hover:bg-slate-900/50">
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${
                          link.status === "SUCCESS" || link.status === "PAID"
                            ? "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20"
                            : link.status === "PENDING"
                            ? "bg-amber-500/10 text-amber-400 ring-amber-500/20"
                            : "bg-rose-500/10 text-rose-400 ring-rose-500/20"
                        }`}>
                          {link.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-200">{link.description}</td>
                      <td className="px-6 py-4 text-slate-400">{link.customer_email || "—"}</td>
                      <td className="px-6 py-4 font-medium text-slate-200">{link.amount} AED</td>
                      <td className="px-6 py-4 text-slate-400">{new Date(link.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleCopy(link.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
                        >
                          {copiedId === link.id ? (
                            <><CheckIcon className="size-3.5 text-emerald-400" /> Copied</>
                          ) : (
                            <><CopyIcon className="size-3.5" /> Copy Link</>
                          )}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 p-5">
              <h3 className="text-lg font-semibold text-white">Create Payment Link</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <form onSubmit={handleCreateLink} className="p-5 space-y-4">
              {error && <div className="text-sm text-rose-400 p-3 bg-rose-500/10 rounded-lg">{error}</div>}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Amount (AED)</label>
                <input
                  type="number"
                  required
                  min="1"
                  step="0.01"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="e.g. 150.00"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Description</label>
                <input
                  type="text"
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="e.g. AC Repair Custom Invoice"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-300">Customer Email (Optional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-2.5 text-white placeholder:text-slate-500 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="customer@example.com"
                />
              </div>
              <div className="mt-6 flex justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl px-4 py-2 text-sm font-medium text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-sky-500 px-5 py-2 text-sm font-medium text-white shadow hover:bg-sky-400 disabled:opacity-50"
                >
                  {isSubmitting ? "Creating..." : "Generate Link"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
