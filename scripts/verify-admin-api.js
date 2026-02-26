/**
 * Verifies admin API routes require authentication.
 * Run with: node scripts/verify-admin-api.js
 * Prerequisite: Start the app first (npm run dev) and set BASE_URL if not using default.
 *
 * Expects:
 * - GET /api/admin without cookie → 401 or 403
 * - GET /api/admin/trending without cookie → 401 or 403
 */

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";

async function request(method, path, options = {}) {
  const url = `${BASE_URL}${path}`;
  const res = await fetch(url, {
    method,
    headers: options.headers || {},
    ...options,
  });
  return { status: res.status, ok: res.ok, body: await res.text() };
}

async function main() {
  console.log("Admin API verification (no auth)\nBase URL:", BASE_URL);
  console.log("");

  let failed = 0;

  // 1. GET /api/admin without cookie should be 401 or 403
  const dashboard = await request("GET", "/api/admin");
  if (dashboard.status === 401 || dashboard.status === 403) {
    console.log("✓ GET /api/admin (no cookie):", dashboard.status, "- rejected as expected");
  } else {
    console.log("✗ GET /api/admin (no cookie):", dashboard.status, "- expected 401 or 403");
    failed++;
  }

  // 2. GET /api/admin/trending without cookie should be 401 or 403
  const trending = await request("GET", "/api/admin/trending?period=month");
  if (trending.status === 401 || trending.status === 403) {
    console.log("✓ GET /api/admin/trending (no cookie):", trending.status, "- rejected as expected");
  } else {
    console.log("✗ GET /api/admin/trending (no cookie):", trending.status, "- expected 401 or 403");
    failed++;
  }

  console.log("");
  if (failed === 0) {
    console.log("All checks passed. Admin routes require auth.");
  } else {
    console.log(failed, "check(s) failed.");
    process.exit(1);
  }
}

main().catch((err) => {
  console.error("Error:", err.message);
  console.error("Make sure the app is running (e.g. npm run dev) and BASE_URL is correct.");
  process.exit(1);
});
