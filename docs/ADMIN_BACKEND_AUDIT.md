# Admin Backend Functionality – Internal Audit

This document lists all admin-related backend behaviour: creation/deletion of the admin account and each admin feature, with verification notes.

---

## 1. Admin account creation and deletion

| Action | How it works | Backend / notes |
|--------|----------------|-----------------|
| **Create admin** | Only via **seed script**: `npm run seed:admin`. Creates one user `admin@fixnex.com` with `role: ADMIN` and an empty cart. | ✅ Implemented in `scripts/seed-admin.js`. Idempotent (skips if user already exists). |
| **Delete admin** | No in-app “delete admin” or “delete user” flow. To remove admin: delete or change the user in the database (e.g. set `role: USER` or delete the row). | No backend endpoint for this. Use DB client or a one-off script if needed. |

Signup and login do **not** assign or change admin; they only create/login **USER** accounts. Only the seed (or manual DB update) sets `role: ADMIN`.

---

## 2. Admin-only API routes (with backend auth)

These routes now **require** an authenticated admin (session cookie + `role === ADMIN`). Non-admin or unauthenticated requests get **401** or **403**.

| Feature | Method | Route | Backend check | Status |
|--------|--------|--------|----------------|--------|
| Dashboard metrics | GET | `/api/admin` | ✅ `requireAdmin(request)` | ✅ Working |
| Trending services | GET | `/api/admin/trending?period=day\|week\|month\|year` | ✅ `requireAdmin(request)` | ✅ Working |

Implementation: `lib/requireAdmin.ts` uses `getSessionFromRequest` and Prisma to ensure the user exists and has `role: ADMIN`. Used in `app/api/admin/admin.controller.ts` for both dashboard and trending.

---

## 3. Bookings APIs used by admin (no backend role check)

The admin UI uses these booking endpoints. They **do not** currently verify admin (or any) role; they are “open” from the backend’s perspective. Access control is only via the frontend (admin layout hides pages from non-admins).

| Feature | Method | Route | Backend auth | Status |
|--------|--------|--------|--------------|--------|
| List all bookings (filters, pagination) | GET | `/api/bookings?page=&pageSize=&status=&search=&...` | ❌ None | ⚠️ Works but not restricted to admin |
| Get one booking | GET | `/api/bookings/[id]` | ❌ None | ⚠️ Same |
| Update booking (status, details) | PATCH | `/api/bookings/[id]` | ❌ None | ⚠️ Same |
| Delete booking | DELETE | `/api/bookings/[id]` | ❌ None | ⚠️ Same |
| Update booking cart item | PATCH | `/api/booking-cart-items/[id]` | ❌ None | ⚠️ Same |
| Delete booking cart item | DELETE | `/api/booking-cart-items/[id]` | ❌ None | ⚠️ Same |

Logic in `app/api/bookings/bookings.service.ts` and `app/api/booking-cart-items/` is correct (filters, update, delete). To restrict these to admins only, add `requireAdmin(request)` (or equivalent) in the corresponding controllers and return 403 when not admin.

---

## 4. Auth used by admin UI

| Feature | Route | Purpose |
|--------|--------|--------|
| Session (current user + role) | GET `/api/auth/session` | Used by `AdminLayout` to allow/deny access to admin pages. Returns user including `role`. |
| Login | POST `/api/auth/login` | Admin logs in with same endpoint as regular users; role comes from DB. |

Session and login are shared with normal users; admin is determined by `user.role === 'ADMIN'`.

---

## 5. Quick verification checklist

- **Admin creation**  
  - Run `npm run seed:admin` (with correct `DATABASE_URL`).  
  - Confirm user `admin@fixnex.com` exists with `role: ADMIN` and a cart.

- **Dashboard**  
  - Log in as admin.  
  - Open `/admin-dashboard`.  
  - Dashboard and trending sections load (they call `/api/admin` and `/api/admin/trending`).  
  - Log out or use incognito; call `GET /api/admin` with no cookie → expect **401** or **403**.

- **Trending**  
  - On dashboard, change period (Today / 7 days / Month / Year).  
  - Each request goes to `/api/admin/trending?period=...`.  
  - Without admin cookie → **401** or **403**.

- **Bookings list**  
  - Open `/admin`, filters and table load.  
  - Backend: `GET /api/bookings?page=1&pageSize=10&...` returns list and pagination.

- **Edit booking**  
  - In admin bookings table, click Edit on a booking.  
  - Change status or cart item fields and save.  
  - Backend: `PATCH /api/bookings/[id]` and `PATCH /api/booking-cart-items/[id]` are used; responses and DB updates should succeed.

- **Delete**  
  - There is no “delete booking” or “delete user” button in the current admin UI.  
  - Backend: `DELETE /api/bookings/[id]` exists and works; `DELETE /api/booking-cart-items/[id]` exists.  
  - Deletion of the **admin account** itself is only via DB (or a custom script), not via an API.

---

## 6. Summary

| Area | Working? | Notes |
|------|----------|--------|
| Admin account creation | ✅ | Seed script only; no in-app creation. |
| Admin account deletion | ➖ | No in-app or API; DB/manual only. |
| Dashboard metrics (GET /api/admin) | ✅ | Backend now enforces admin. |
| Trending services (GET /api/admin/trending) | ✅ | Backend now enforces admin. |
| Bookings list/update/delete APIs | ✅ | Logic works; no backend admin check yet. |
| Booking cart item update/delete | ✅ | Logic works; no backend admin check yet. |

For production, consider adding `requireAdmin()` (or equivalent) to the bookings and booking-cart-items routes that are only intended for admin use (e.g. list all bookings, PATCH/DELETE any booking).
