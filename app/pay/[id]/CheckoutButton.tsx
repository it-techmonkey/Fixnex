"use client";

import { useState } from "react";
import { ShieldCheckIcon } from "lucide-react";

export function CheckoutButton({ linkId }: { linkId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/payment/initiate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ custom_link_id: linkId }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to initiate payment");
      }

      // Create a form dynamically and submit it to CCAvenue actionUrl
      const form = document.createElement("form");
      form.method = "POST";
      form.action = data.actionUrl;

      const encReqInput = document.createElement("input");
      encReqInput.type = "hidden";
      encReqInput.name = "encRequest";
      encReqInput.value = data.encRequest;
      form.appendChild(encReqInput);

      const accessCodeInput = document.createElement("input");
      accessCodeInput.type = "hidden";
      accessCodeInput.name = "access_code";
      accessCodeInput.value = data.accessCode;
      form.appendChild(accessCodeInput);

      document.body.appendChild(form);
      form.submit();
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    }
  };

  return (
    <div className="mt-8">
      {error && <div className="mb-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}
      
      <button
        onClick={handleCheckout}
        disabled={loading}
        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-sky-500 px-4 py-4 text-lg font-semibold text-white shadow-lg transition hover:bg-sky-600 hover:shadow-xl active:scale-[0.98] disabled:opacity-70"
      >
        <ShieldCheckIcon className={`size-5 ${loading ? "animate-pulse" : "transition group-hover:scale-110"}`} />
        {loading ? "Processing..." : "Pay Securely via CCAvenue"}
      </button>
      
      <p className="mt-4 text-center text-xs text-slate-500">
        Your payment is safely processed by CCAvenue. We do not store your card details.
      </p>
    </div>
  );
}
