# Admin Login

## How user vs admin is decided

- **When you sign up** (create a new account on the app), you are always created as a **USER**. The app does not ask you to choose a role; there is no “sign up as admin” option.
- **When you log in**, you get the role that is already stored for that account:
  - If you signed up yourself → you are a **USER**. You can use the service (bookings, cart, etc.) but you cannot open the admin dashboard or the admin bookings page.
  - If you log in with an account that was explicitly given the **ADMIN** role (see below), you are an admin and can access `/admin-dashboard` and `/admin`.
- **How someone becomes an admin:** In this codebase, the only way to have an admin is to create or update a user in the database with `role = ADMIN`. By default that is done by running the seed script (see “Creating the admin user” below), which creates a single admin user. There is no in-app screen to “promote” a user to admin; you would need to change the user’s role in the database or run a custom script.

**Summary:** Normal signup/login → you are a **USER**. To be an **ADMIN**, the account must have been set to admin in the database (e.g. via `npm run seed:admin` or a manual DB update).

---

There is no default admin password. The password is never stored in this repository.

## Creating the admin user

Choose a strong password (at least 8 characters, with a letter and a number) and run:

```bash
ADMIN_EMAIL=admin@fixnex.com ADMIN_PASSWORD='choose-a-strong-password' npm run seed:admin
```

Then log in at the app's login page with that email and password.

## Changing or recovering the password

- **Know the current password:** sign in, open **Admin > Account** and use *Change password*.
- **Forgot it:** use *Forgot password?* on the login page. A reset link is emailed to the account address.

**Security:** Never share the admin password, and do not reuse it on other sites.

---

## Vercel (and other production) deployment

If the admin exists in your DB but **login still fails** on Vercel, check the following.

### 1. Environment variables on Vercel

In your Vercel project → **Settings → Environment Variables**, set:

- **`JWT_SECRET`** – Required for login. Any long, random string (e.g. from `openssl rand -base64 32`). If this is missing, login returns a 500 and you may see a message about JWT_SECRET.
- **`DATABASE_URL`** – Your Postgres connection string. Must point to the **same** database where the admin user exists.

Redeploy after changing env vars.

### 2. Admin user must be in the **same** database Vercel uses

The app on Vercel uses `DATABASE_URL` from Vercel. The admin user must exist in that database.

- If you only ran `npm run seed:admin` **locally**, that created the user in your **local** DB. Vercel uses the **production** DB, so login will return “Invalid email or password.”
- **Fix:** Create the admin in the production DB by running the seed with the **same** `DATABASE_URL` that Vercel uses:

  ```bash
  DATABASE_URL="postgresql://user:password@host:5432/dbname?sslmode=require" npm run seed:admin
  ```

  Use the exact connection string from Vercel (or your hosted Postgres). Then try logging in again on the deployed site.

### 3. Cookie / session after login

- Use the **same** domain you’re logging in on (e.g. `your-app.vercel.app`). Don’t mix preview URLs and production URL for testing login; cookies are per-domain.
- If login returns 200 but the next page doesn’t see you as logged in, check the browser’s Application → Cookies and confirm `fixnex_token` is set for your domain.
