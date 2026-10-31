// Plan-related emails. None of these throw: a failed email is logged and never blocks a payment
// or a booking.
import { resend } from "@/lib/resend";

const FROM = () => process.env.ENQUIRY_FROM_EMAIL || "payment@fixnex.ae";
const TEAM = () => process.env.ENQUIRY_TO_EMAIL || "info@fixnex.ae";
const APP_URL = () => (process.env.NEXT_PUBLIC_APP_URL ?? "").replace(/\/$/, "");

export const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Simple branded email: a heading, an optional intro, a table of details and an optional button. */
export function simpleEmailHtml(options: {
  heading: string;
  intro?: string;
  rows?: Array<[string, string]>;
  button?: { label: string; href: string };
  footer?: string;
}) {
  const rows = (options.rows ?? [])
    .map(
      ([label, value]) => `
        <tr>
          <td style="padding: 8px 12px 8px 0; color: #777; vertical-align: top; white-space: nowrap;">${escapeHtml(label)}</td>
          <td style="padding: 8px 0; color: #111; white-space: pre-wrap;">${escapeHtml(value)}</td>
        </tr>`
    )
    .join("");
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #111; padding: 20px; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 18px; letter-spacing: 2px;">FIXNEX</h1>
      </div>
      <div style="border: 1px solid #eaeaea; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
        <h2 style="margin: 0 0 12px; font-size: 18px; color: #111;">${escapeHtml(options.heading)}</h2>
        ${options.intro ? `<p style="margin: 0 0 16px; font-size: 14px; color: #333; line-height: 22px;">${escapeHtml(options.intro)}</p>` : ""}
        ${rows ? `<table style="width: 100%; border-collapse: collapse; font-size: 14px;">${rows}</table>` : ""}
        ${
          options.button
            ? `<p style="margin: 24px 0 0;"><a href="${escapeHtml(options.button.href)}" style="display: inline-block; background: #0ea5e9; color: #fff; text-decoration: none; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600;">${escapeHtml(options.button.label)}</a></p>`
            : ""
        }
        ${options.footer ? `<p style="margin: 24px 0 0; font-size: 12px; color: #888;">${escapeHtml(options.footer)}</p>` : ""}
      </div>
    </div>`;
}

async function send(to: string, subject: string, html: string) {
  try {
    if (!process.env.RESEND_API_KEY || !to) return false;
    const { error } = await resend.emails.send({ from: FROM(), to, subject, html });
    if (error) {
      console.error(`Email "${subject}" to ${to} failed:`, error);
      return false;
    }
    return true;
  } catch (err) {
    console.error(`Email "${subject}" to ${to} failed:`, err);
    return false;
  }
}

/** Receipt for a paid plan month or upgrade, using the same invoice layout as bookings. */
export async function sendPlanReceipt(options: {
  to: string;
  customerName: string;
  customerId: string;
  orderCode: string;
  description: string;
  amount: string;
  transactionId: string;
}) {
  try {
    const { InvoiceEmail } = await import("@/app/components/emails/InvoiceEmail");
    const { render } = await import("@react-email/components");
    const html = await render(
      InvoiceEmail({
        customerName: options.customerName,
        customerEmail: options.to,
        customerId: options.customerId,
        orderId: options.orderCode,
        transactionId: options.transactionId,
        amount: options.amount,
        date: new Date().toLocaleDateString("en-GB", { timeZone: "Asia/Dubai" }),
        time: new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Dubai" }),
        serviceName: options.description,
        status: "SUCCESS",
      })
    );
    return send(options.to, `Payment Receipt - ${options.orderCode}`, html);
  } catch (err) {
    console.error("Failed to build plan receipt:", err);
    return false;
  }
}

/** Confirmation for a booking fully covered by the customer's plan (no payment taken). */
export function sendIncludedBookingEmail(options: {
  to: string;
  customerName: string;
  bookingCode: string;
  planName: string;
  services: string[];
  date: string;
  timeSlot: string;
  location: string;
}) {
  return send(
    options.to,
    `Booking confirmed - ${options.bookingCode}`,
    simpleEmailHtml({
      heading: "Your booking is confirmed",
      intro: `Hi ${options.customerName}, this visit is included in your ${options.planName} plan, so there is nothing to pay. Parts, if any are needed, are charged at cost after the visit.`,
      rows: [
        ["Booking ID", options.bookingCode],
        ["Services", options.services.join(", ")],
        ["Date", options.date],
        ["Time", options.timeSlot],
        ["Location", options.location],
        ["Price", `AED 0.00 (included in ${options.planName})`],
      ],
      button: APP_URL() ? { label: "View my bookings", href: `${APP_URL()}/bookings` } : undefined,
    })
  );
}

export function sendPlanReminderEmail(options: {
  to: string;
  customerName: string;
  planName: string;
  endsOn: string;
}) {
  return send(
    options.to,
    `Your ${options.planName} plan ends on ${options.endsOn}`,
    simpleEmailHtml({
      heading: `Your ${options.planName} plan ends on ${options.endsOn}`,
      intro: `Hi ${options.customerName}, your plan does not renew automatically. To keep your included visits and member prices, pay for next month before it ends. Your new month starts the day the current one ends, so you won't lose any days.`,
      button: APP_URL() ? { label: "Pay for next month", href: `${APP_URL()}/my-plan` } : undefined,
      footer: "If you don't want to continue, you don't need to do anything.",
    })
  );
}

export function sendPlanExpiredEmail(options: { to: string; customerName: string; planName: string }) {
  return send(
    options.to,
    `Your ${options.planName} plan has ended`,
    simpleEmailHtml({
      heading: `Your ${options.planName} plan has ended`,
      intro: `Hi ${options.customerName}, your plan has ended, so bookings are now charged at normal prices. You can start a new month at any time from My Plan.`,
      button: APP_URL() ? { label: "Restart my plan", href: `${APP_URL()}/my-plan` } : undefined,
    })
  );
}

/** Short notice to the Fixnex team inbox. */
export function notifyTeam(subject: string, heading: string, rows: Array<[string, string]>) {
  return send(TEAM(), subject, simpleEmailHtml({ heading, rows }));
}
