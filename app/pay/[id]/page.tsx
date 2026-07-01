import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Header from "@/app/components/layout/Header";
import Footer from "@/app/components/layout/Footer";
import { ShieldCheckIcon, CreditCardIcon } from "lucide-react";
import { CheckoutButton } from "./CheckoutButton";

export default async function CustomPaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const link = await prisma.customPaymentLink.findUnique({
    where: { id },
  });

  if (!link) {
    notFound();
  }

  const isPaid = link.status === "SUCCESS";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#0A0A0A] pt-28 pb-20">
        <div className="mx-auto max-w-xl px-4 sm:px-6">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">Secure Checkout</h1>
            <p className="mt-2 text-gray-400">Fixnex Custom Services</p>
          </div>

          <div className="overflow-hidden rounded-2xl bg-[#111111] border border-gray-800 shadow-2xl">
            {/* Invoice Header */}
            <div className="bg-[#1A1A1A] px-6 py-8 text-center sm:px-8 border-b border-gray-800">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-900/20 ring-4 ring-blue-900/10">
                <CreditCardIcon className="size-8 text-blue-500" />
              </div>
              <h2 className="text-xl font-semibold text-white">Payment Request</h2>
              <p className="mt-1 text-gray-400">Ref: {link.id}</p>
            </div>

            {/* Invoice Body */}
            <div className="px-6 py-8 sm:px-8">
              {isPaid ? (
                <div className="text-center">
                  <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-900/20 ring-4 ring-emerald-900/10">
                    <ShieldCheckIcon className="size-8 text-emerald-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white">Payment Completed</h3>
                  <p className="mt-2 text-gray-400">
                    This custom payment request has already been successfully paid.
                    Thank you for choosing Fixnex!
                  </p>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500">Service Description</h3>
                      <p className="mt-2 text-lg text-gray-200">{link.description}</p>
                    </div>

                    <div className="h-px bg-gray-800" />

                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-300">Total Amount Due</h3>
                      <div className="text-right">
                        <span className="text-3xl font-bold text-white">{link.amount}</span>
                        <span className="ml-1 text-sm font-medium text-gray-400">AED</span>
                      </div>
                    </div>
                  </div>

                  <CheckoutButton linkId={link.id} />
                </>
              )}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
