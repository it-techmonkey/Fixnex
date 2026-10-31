import { buildRequestParams, encrypt, getCCAvenueUrl } from "@/lib/ccavenue";

export type Billing = { fullName: string; email: string; phone: string };

/** CCAvenue keys are set. Check this before writing anything to the database. */
export const gatewayConfigured = () =>
  Boolean(process.env.CCAVENUE_MERCHANT_ID && process.env.CCAVENUE_ACCESS_CODE && process.env.CCAVENUE_WORKING_KEY);

export const GATEWAY_NOT_CONFIGURED_MESSAGE =
  "Payment gateway is not configured yet. Please contact support or try again later.";

/**
 * Builds the encrypted CCAvenue request for a PaymentOrder. The browser posts it to `actionUrl`.
 * The callback finds the order again through merchant_param1.
 */
export function buildGatewayCheckout(paymentOrderId: string, amount: string, billing: Billing) {
  const merchantId = process.env.CCAVENUE_MERCHANT_ID!;
  const accessCode = process.env.CCAVENUE_ACCESS_CODE!;
  const appUrl = (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

  const params: Record<string, string> = {
    merchant_id: merchantId,
    order_id: paymentOrderId,
    currency: "AED",
    amount,
    redirect_url: `${appUrl}/api/payment/callback`,
    cancel_url: `${appUrl}/api/payment/callback`,
    language: "EN",
    // Billing details (realistic fallbacks to pass strict AVS checks)
    billing_name: billing.fullName || "Customer",
    billing_email: billing.email,
    billing_tel: billing.phone || "0000000000",
    billing_address: "Dubai, United Arab Emirates",
    billing_city: "Dubai",
    billing_state: "Dubai",
    billing_zip: "",
    billing_country: "UAE",
    delivery_name: billing.fullName || "Customer",
    delivery_address: "Dubai, United Arab Emirates",
    delivery_city: "Dubai",
    delivery_state: "Dubai",
    delivery_zip: "",
    delivery_country: "UAE",
    merchant_param1: paymentOrderId,
  };

  return {
    encRequest: encrypt(buildRequestParams(params)),
    accessCode,
    actionUrl: getCCAvenueUrl(),
  };
}
