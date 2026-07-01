"use client";

import { useEffect, useState } from "react";
import { AdminLayout } from "@/app/components/admin/AdminLayout";

type PaymentUser = { id: string; name: string; email: string };
type Payment = {
  id: string;
  transaction_id: string;
  tracking_id: string;
  amount: string;
  status: string;
  created_at: string;
  service_name: string;
  user: PaymentUser;
  booking_id: string | null;
  payment_mode?: string;
  card_name?: string;
};

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  useEffect(() => {
    const fetchPayments = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/admin/payments?search=${encodeURIComponent(search)}`);
        if (res.ok) {
          const data = await res.json();
          setPayments(data);
        }
      } catch (error) {
        console.error("Failed to fetch payments:", error);
      } finally {
        setLoading(false);
      }
    };
    
    // Debounce search
    const timer = setTimeout(() => {
      fetchPayments();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  return (
    <AdminLayout title="Payments Ledger" currentNav="payments">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-white">Payment Transactions</h2>
            <p className="text-sm text-slate-400">View and track all successful and failed payments.</p>
          </div>
          
          <div className="relative w-full sm:w-72">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <SearchIcon className="size-4 text-slate-500" />
            </div>
            <input
              type="text"
              placeholder="Search by name, ID, or amount..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 transition focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>
        </div>

        <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-800/50 text-xs uppercase text-slate-400">
                <tr>
                  <th scope="col" className="px-6 py-4 font-semibold">Date</th>
                  <th scope="col" className="px-6 py-4 font-semibold">User Info</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Amount</th>
                  <th scope="col" className="px-6 py-4 font-semibold">Status</th>
                  <th scope="col" className="px-6 py-4 text-right font-semibold">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      <div className="flex justify-center"><div className="size-6 animate-spin rounded-full border-2 border-sky-500/30 border-t-sky-400" /></div>
                    </td>
                  </tr>
                ) : payments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                      No payments found.
                    </td>
                  </tr>
                ) : (
                  payments.map((payment) => (
                    <tr key={payment.id} className="transition-colors hover:bg-slate-800/30">
                      <td className="whitespace-nowrap px-6 py-4">
                        {new Date(payment.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-white">{payment.user.name}</div>
                        <div className="text-xs text-slate-500">{payment.user.id}</div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 font-medium text-white">
                        AED {payment.amount}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {payment.status === "Success" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400 border border-emerald-500/20">
                            Successful
                          </span>
                        ) : payment.status === "Aborted" || payment.status === "Failure" ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-2.5 py-1 text-xs font-medium text-rose-400 border border-rose-500/20">
                            Failed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-400 border border-amber-500/20">
                            {payment.status}
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <button
                          onClick={() => setSelectedPayment(payment)}
                          className="inline-flex items-center justify-center rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-700 hover:text-white"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal */}
        {selectedPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-md" onClick={() => setSelectedPayment(null)} />
            <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-slate-700/50 bg-slate-950 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
              
              {/* Top ambient glow */}
              <div className={`absolute top-0 left-1/2 h-32 w-full -translate-x-1/2 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${selectedPayment.status === "Success" ? "from-emerald-500/20" : "from-rose-500/20"} to-transparent opacity-60`} />

              <div className="relative border-b border-slate-800/80 px-6 py-5 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white tracking-tight flex items-center gap-2">
                  <ReceiptIcon className="size-5 text-sky-400" />
                  Payment Receipt
                </h3>
                <button onClick={() => setSelectedPayment(null)} className="rounded-full p-1.5 text-slate-400 transition-colors hover:bg-slate-800 hover:text-white">
                  <CloseIcon className="size-5" />
                </button>
              </div>
              
              <div className="relative p-6 sm:p-8 space-y-8">
                {/* Header info */}
                <div className="flex flex-col items-center justify-center text-center">
                  <div className={`mb-4 flex size-16 items-center justify-center rounded-full border-4 ${selectedPayment.status === "Success" ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-rose-500/20 bg-rose-500/10 text-rose-400"}`}>
                    {selectedPayment.status === "Success" ? <CheckCircleIcon className="size-8" /> : <XCircleIcon className="size-8" />}
                  </div>
                  <div className="text-sm font-medium uppercase tracking-wider text-slate-400 mb-1">Total Amount</div>
                  <div className="text-4xl font-extrabold tracking-tight text-white">AED {selectedPayment.amount}</div>
                  <div className={`mt-2 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-widest ${selectedPayment.status === "Success" ? "bg-emerald-500/10 text-emerald-400" : "bg-rose-500/10 text-rose-400"}`}>
                    {selectedPayment.status === "Success" ? "Successful" : "Failed"}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Customer Card */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <UserIcon className="size-4" /> Customer Details
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Name</span>
                        <span className="font-medium text-slate-200">{selectedPayment.user.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Email</span>
                        <span className="font-medium text-slate-200 truncate max-w-[120px]" title={selectedPayment.user.email}>{selectedPayment.user.email}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">ID</span>
                        <span className="font-mono text-xs text-slate-500 truncate max-w-[120px]" title={selectedPayment.user.id}>{selectedPayment.user.id}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transaction Card */}
                  <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-4">
                    <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-500">
                      <CreditCardIcon className="size-4" /> Transaction Info
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Date</span>
                        <span className="font-medium text-slate-200">{new Date(selectedPayment.created_at).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Time</span>
                        <span className="font-medium text-slate-200">{new Date(selectedPayment.created_at).toLocaleTimeString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Service</span>
                        <span className="font-medium text-sky-400 truncate max-w-[120px]" title={selectedPayment.service_name}>{selectedPayment.service_name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* CCAvenue Reference block */}
                <div className="rounded-2xl bg-slate-900/80 p-4 ring-1 ring-inset ring-slate-800">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">CCAvenue Reference</span>
                      <span className="font-mono text-sm text-slate-300 break-all">{selectedPayment.tracking_id}</span>
                    </div>
                    <div className="h-px w-full bg-slate-800/80" />
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Bank Transaction ID</span>
                      <span className="font-mono text-sm text-slate-300 break-all">{selectedPayment.transaction_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative border-t border-slate-800/80 bg-slate-900/50 px-6 py-4 flex justify-end">
                <button
                  onClick={() => setSelectedPayment(null)}
                  className="rounded-xl bg-slate-800 px-6 py-2.5 text-sm font-semibold text-white shadow-sm ring-1 ring-inset ring-slate-700 transition-all hover:bg-slate-700 hover:ring-slate-600"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}

function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function XCircleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}

function ReceiptIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z" />
      <path d="M16 14h-4" />
      <path d="M16 10H8" />
    </svg>
  );
}

function UserIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function CreditCardIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  );
}
