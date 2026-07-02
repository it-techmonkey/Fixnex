require("dotenv").config({ path: ".env" }); // Load env variables
const { Resend } = require("resend");

// Hardcode API key for testing script only (in production it comes from .env)
const resend = new Resend("re_JVa7cpke_ACNxFy9egUm2MRpBhe7XS2ew");

async function testReactEmail() {
  console.log("Compiling and sending React email...");
  
  try {
    // We'll dynamically import the compiled Next.js build or use a simple TS node script?
    // Wait, we can't easily compile JSX/TSX in a plain Node.js script without ts-node or Next's compiler.
    // Instead of messing with compilation in a node script, I'll hit an API endpoint that renders it!
    
  } catch (error) {
    console.error("Failed to send email:", error);
  }
}

testReactEmail();
