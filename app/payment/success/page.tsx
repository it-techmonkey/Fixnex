"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";

const PaymentSuccessContent = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center text-white space-y-6 px-4">
      {/* Icon */}
      <div className="size-20 rounded-full bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="size-10 text-emerald-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div className="space-y-3 max-w-lg">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-semibold font-['Space_Grotesk']">
          Payment Successful
        </h1>
        <p className="text-white/70 text-sm sm:text-base">
          Your booking has been confirmed. Our team will reach out shortly to finalise the details.
        </p>
        {orderId && (
          <p className="text-white/40 text-xs font-mono">
            Reference: {orderId}
          </p>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 pt-2">
        <a
          href="/bookings"
          className="px-6 py-3 text-sm sm:text-base bg-linear-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-lg font-semibold font-['Space_Grotesk'] transition-all duration-300 hover:scale-105 shadow-lg shadow-blue-500/30"
        >
          View My Bookings
        </a>
        <a
          href="/services"
          className="px-6 py-3 text-sm sm:text-base border border-white/30 text-white rounded-lg font-['Space_Grotesk'] hover:bg-white/10 transition"
        >
          Browse More Services
        </a>
      </div>
    </div>
  );
};

const PaymentSuccessPage = () => {
  return (
    <div className="w-full bg-[#0f0f0f] min-h-screen">
      <div className="w-full bg-[#0f0f0f] pt-20 relative z-10">
        <Header />
        <div className="w-full bg-black min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
            <Suspense
              fallback={
                <div className="min-h-[70vh] flex items-center justify-center">
                  <div className="size-10 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                </div>
              }
            >
              <PaymentSuccessContent />
            </Suspense>
          </div>
          <Footer />
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccessPage;
