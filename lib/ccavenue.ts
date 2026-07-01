/**
 * CCAvenue payment gateway utilities.
 *
 * IMPORTANT: This file is server-side only.
 * Never import it from a "use client" component.
 *
 * Encryption spec (CCAvenue standard):
 *   Algorithm : AES-128-CBC
 *   Key       : MD5 hash of the Working Key (16 bytes)
 *   IV        : 16 zero bytes
 *   Input     : UTF-8 plain text
 *   Output    : lowercase hex string
 */

import crypto from "crypto";

const CCAVENUE_TEST_URL =
  "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction";
const CCAVENUE_PROD_URL =
  "https://secure.ccavenue.ae/transaction/transaction.do?command=initiateTransaction";

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function getWorkingKey(): string {
  const key = process.env.CCAVENUE_WORKING_KEY;
  if (!key) {
    throw new Error("CCAVENUE_WORKING_KEY environment variable is not set.");
  }
  return key;
}

function deriveCryptoKey(workingKey: string): Buffer {
  // CCAvenue spec: key = MD5(workingKey) → 16 bytes for AES-128
  return crypto.createHash("md5").update(workingKey).digest();
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/** Encrypt a plain-text parameter string using CCAvenue AES-128-CBC. */
export function encrypt(plainText: string): string {
  const key = deriveCryptoKey(getWorkingKey());
  const iv = Buffer.alloc(16, 0); // 16 zero bytes
  const cipher = crypto.createCipheriv("aes-128-cbc", key, iv);
  let encrypted = cipher.update(plainText, "utf8", "hex");
  encrypted += cipher.final("hex");
  return encrypted;
}

/** Decrypt a CCAvenue hex-encoded AES-128-CBC cipher text. */
export function decrypt(encryptedText: string): string {
  const key = deriveCryptoKey(getWorkingKey());
  const iv = Buffer.alloc(16, 0);
  const decipher = crypto.createDecipheriv("aes-128-cbc", key, iv);
  let decrypted = decipher.update(encryptedText, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

/** Return the correct CCAvenue payment page URL based on CCAVENUE_ENV. */
export function getCCAvenueUrl(): string {
  return process.env.CCAVENUE_ENV === "PROD" ? CCAVENUE_PROD_URL : CCAVENUE_TEST_URL;
}

/**
 * Serialize a params object to a CCAvenue-compatible query string.
 * e.g. { merchant_id: "123", amount: "100.00" } → "merchant_id=123&amount=100.00"
 */
export function buildRequestParams(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join("&");
}

/**
 * Parse a CCAvenue decrypted response string into a key-value map.
 * Handles values that contain "=" (e.g. base64 encoded fields).
 */
export function parseCCResponse(decryptedText: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const pair of decryptedText.split("&")) {
    const eqIndex = pair.indexOf("=");
    if (eqIndex === -1) continue;
    const key = pair.substring(0, eqIndex);
    const value = pair.substring(eqIndex + 1);
    if (key) {
      result[key] = value;
    }
  }
  return result;
}
