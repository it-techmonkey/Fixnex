import { NextResponse } from "next/server";
import { resend } from "@/lib/resend";
import { InvoiceEmail } from "@/app/components/emails/InvoiceEmail";
import { render } from "@react-email/components";

export async function GET() {
  try {
    const htmlOutput = await render(InvoiceEmail({
      customerName: "Jane Doe",
      customerEmail: "jane.doe@example.com",
      customerId: "USR-9876",
      orderId: "ORD-554433",
      transactionId: "TXN-998877",
      amount: "500.00",
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      serviceName: "Full Home Deep Cleaning",
      status: "SUCCESS",
    }));

    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "payment@fixnex.ae",
      subject: "Your Premium Receipt from Fixnex",
      html: htmlOutput,
    });

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Test email failed:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
