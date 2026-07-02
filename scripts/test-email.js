const { Resend } = require("resend");

// Hardcode API key for testing script only (in production it comes from .env)
const resend = new Resend("re_JVa7cpke_ACNxFy9egUm2MRpBhe7XS2ew");

// In this simple test script, we just use raw HTML since we can't easily compile React outside of Next.js here.
// But in the real app, it uses the beautiful React component!
async function testEmail() {
  console.log("Sending test email...");
  
  try {
    const data = await resend.emails.send({
      from: "onboarding@resend.dev",
      to: "payment@fixnex.ae", // Sending to the verified email
      subject: "Test Receipt - Fixnex",
      html: `
        <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #111; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
            <h1 style="color: white; margin: 0; letter-spacing: 2px;">FIXNEX</h1>
          </div>
          <div style="border: 1px solid #eaeaea; border-top: none; padding: 30px; border-radius: 0 0 8px 8px;">
            <p>Hi Valued Customer,</p>
            <p>Thank you for choosing Fixnex! This is a test receipt.</p>
            
            <div style="background-color: #fafafa; border: 1px solid #eaeaea; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 5px 0; color: #555;"><strong>Service:</strong> Fixnex Service</p>
              <p style="margin: 5px 0; color: #555;"><strong>Transaction ID:</strong> TEST-123456</p>
              <p style="margin: 5px 0; color: #555;"><strong>Status:</strong> <span style="background-color: #dcfce7; color: #166534; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold;">SUCCESS</span></p>
              <p style="margin: 5px 0; color: #555;"><strong>Date & Time:</strong> ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</p>
              <hr style="border: none; border-top: 1px solid #eaeaea; margin: 15px 0;" />
              <p style="margin: 5px 0; color: #111; font-size: 18px;"><strong>Total Paid: AED 150.00</strong></p>
            </div>
            
            <p style="color: #888; font-size: 14px; margin-top: 30px;">Best regards,<br/>The Fixnex Team</p>
          </div>
        </div>
      `
    });

    console.log("Email sent successfully!");
    console.log("Response Data:", data);
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

testEmail();
