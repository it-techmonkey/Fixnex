import { NextRequest, NextResponse } from "next/server";
import { resend } from "@/lib/resend";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[\d\s\-\+\(\)]+$/;

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const asText = (value: unknown, maxLength: number) =>
  typeof value === "string" ? value.trim().slice(0, maxLength) : "";

export async function POST(request: NextRequest) {
  try {
    // 1. Fail fast if email is not configured
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not configured. Plan enquiries cannot be sent.");
      return NextResponse.json(
        { message: "We could not send your request right now. Please try again later." },
        { status: 503 }
      );
    }

    // 2. Parse + validate body
    const body = (await request.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) {
      return NextResponse.json({ message: "Invalid request." }, { status: 400 });
    }

    const name = asText(body.name, 120);
    const email = asText(body.email, 200);
    const phone = asText(body.phone, 40);
    const message = asText(body.message, 2000);
    const planName = asText(body.planName, 60);
    const propertyLabel = asText(body.propertyLabel, 120);
    const price = asText(typeof body.price === "number" ? String(body.price) : body.price, 60);
    const isEnquiry = body.type === "enquiry";
    const facilities = Array.isArray(body.facilities)
      ? body.facilities.map((f) => asText(f, 60)).filter(Boolean).slice(0, 20)
      : [];

    if (!name || !planName) {
      return NextResponse.json({ message: "Name and plan are required." }, { status: 400 });
    }
    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }
    if (!PHONE_REGEX.test(phone)) {
      return NextResponse.json({ message: "Please enter a valid phone number." }, { status: 400 });
    }

    // 3. Build the email for the team
    const priceText = isEnquiry || !price ? "Custom quote" : `AED ${price} / month`;
    const rows: [string, string][] = [
      ["Request type", isEnquiry ? "Quote enquiry" : "Subscription request"],
      ["Plan", planName],
      ["Property type", propertyLabel || "-"],
      ["Price", priceText],
      ["Name", name],
      ["Email", email],
      ["Phone", phone],
    ];
    if (isEnquiry) {
      rows.push(["Facilities", facilities.length ? facilities.join(", ") : "None selected"]);
      rows.push(["Message", message || "-"]);
    }

    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #111; padding: 20px; border-radius: 8px 8px 0 0;">
          <h1 style="color: white; margin: 0; font-size: 18px; letter-spacing: 2px;">FIXNEX</h1>
        </div>
        <div style="border: 1px solid #eaeaea; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">
          <h2 style="margin: 0 0 16px; font-size: 18px; color: #111;">New ${escapeHtml(planName)} request</h2>
          <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
            ${rows
              .map(
                ([label, value]) => `
            <tr>
              <td style="padding: 8px 12px 8px 0; color: #777; vertical-align: top; white-space: nowrap;">${label}</td>
              <td style="padding: 8px 0; color: #111; white-space: pre-wrap;">${escapeHtml(value)}</td>
            </tr>`
              )
              .join("")}
          </table>
        </div>
      </div>
    `;

    // 4. Send — Resend returns { error } instead of throwing
    const { data, error } = await resend.emails.send({
      from: process.env.ENQUIRY_FROM_EMAIL || "payment@fixnex.ae",
      to: process.env.ENQUIRY_TO_EMAIL || "info@fixnex.ae",
      replyTo: email,
      subject: `New ${planName} ${isEnquiry ? "quote enquiry" : "subscription request"} - ${name}`,
      html,
    });

    if (error) {
      console.error("Failed to send plan enquiry email:", error);
      return NextResponse.json(
        { message: "We could not send your request right now. Please try again later." },
        { status: 502 }
      );
    }

    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Plan enquiry failed:", error);
    return NextResponse.json(
      { message: "We could not send your request right now. Please try again later." },
      { status: 500 }
    );
  }
}
