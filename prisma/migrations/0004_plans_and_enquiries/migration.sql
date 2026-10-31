-- Fixnex: plans (FixLite / FixPro / FixMax), saved enquiries and booking tags.
-- Runs as one transaction: if any step fails, nothing is changed.
-- Safe to run more than once. Does not delete any data.

BEGIN;

-- 1. An old, unused "subscriptions" test table exists (1 test row). Keep it, renamed.
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'subscriptions' AND column_name = 'plan_name'
  ) THEN
    ALTER TABLE "subscriptions" RENAME TO "subscriptions_legacy";
    ALTER TABLE "subscriptions_legacy" RENAME CONSTRAINT "subscriptions_pkey" TO "subscriptions_legacy_pkey";
    ALTER TABLE "subscriptions_legacy" RENAME CONSTRAINT "subscriptions_user_id_fkey" TO "subscriptions_legacy_user_id_fkey";
    ALTER INDEX IF EXISTS "subscriptions_user_id_idx" RENAME TO "subscriptions_legacy_user_id_idx";
  END IF;
END $$;

-- 2. New types
DO $$ BEGIN CREATE TYPE "BookingPaymentStatus" AS ENUM ('PAID', 'INCLUDED', 'UNPAID'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "PaymentPurpose" AS ENUM ('BOOKING', 'PLAN'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "PlanTier" AS ENUM ('FIXLITE', 'FIXPRO', 'FIXMAX'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "SubscriptionStatus" AS ENUM ('ACTIVE', 'CANCELLED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN CREATE TYPE "EnquiryStatus" AS ENUM ('NEW', 'CONTACTED', 'CONVERTED', 'CLOSED'); EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 3. Plans: one row per paid month
CREATE TABLE IF NOT EXISTS "subscriptions" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "plan" "PlanTier" NOT NULL,
    "property_type" TEXT NOT NULL,
    "property_area" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "visits_included" INTEGER,
    "visits_bonus" INTEGER NOT NULL DEFAULT 0,
    "status" "SubscriptionStatus" NOT NULL DEFAULT 'ACTIVE',
    "starts_at" TIMESTAMP(3) NOT NULL,
    "ends_at" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'online',
    "payment_order_id" TEXT,
    "cancelled_at" TIMESTAMP(3),
    "reminder_sent_at" TIMESTAMP(3),
    "expiry_notice_sent_at" TIMESTAMP(3),
    "admin_note" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_code_key" ON "subscriptions"("code");
CREATE UNIQUE INDEX IF NOT EXISTS "subscriptions_payment_order_id_key" ON "subscriptions"("payment_order_id");
CREATE INDEX IF NOT EXISTS "subscriptions_user_id_ends_at_idx" ON "subscriptions"("user_id", "ends_at");

-- 4. Saved plan enquiries
CREATE TABLE IF NOT EXISTS "enquiries" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "plan_id" TEXT NOT NULL,
    "plan_name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "property_type" TEXT,
    "property_label" TEXT,
    "price" TEXT,
    "facilities" TEXT[],
    "message" TEXT,
    "status" "EnquiryStatus" NOT NULL DEFAULT 'NEW',
    "admin_note" TEXT,
    "email_sent" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "enquiries_pkey" PRIMARY KEY ("id")
);
CREATE INDEX IF NOT EXISTS "enquiries_status_created_at_idx" ON "enquiries"("status", "created_at");

-- 5. New columns on existing tables (all optional or with defaults; existing rows are kept)
ALTER TABLE "bookings"
  ADD COLUMN IF NOT EXISTS "payment_status" "BookingPaymentStatus" NOT NULL DEFAULT 'UNPAID',
  ADD COLUMN IF NOT EXISTS "member_plan" "PlanTier",
  ADD COLUMN IF NOT EXISTS "subscription_id" TEXT,
  ADD COLUMN IF NOT EXISTS "property_scope" TEXT,
  ADD COLUMN IF NOT EXISTS "is_priority" BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "is_preventive_check" BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS "bookings_subscription_id_idx" ON "bookings"("subscription_id");

ALTER TABLE "BookingCartItem"
  ADD COLUMN IF NOT EXISTS "coverage" TEXT,
  ADD COLUMN IF NOT EXISTS "subscription_id" TEXT;
CREATE INDEX IF NOT EXISTS "BookingCartItem_subscription_id_idx" ON "BookingCartItem"("subscription_id");

ALTER TABLE "payment_orders"
  ADD COLUMN IF NOT EXISTS "purpose" "PaymentPurpose" NOT NULL DEFAULT 'BOOKING',
  ADD COLUMN IF NOT EXISTS "pricing" JSONB,
  ADD COLUMN IF NOT EXISTS "included_visits" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "plan_request" JSONB;

ALTER TABLE "custom_payment_links"
  ADD COLUMN IF NOT EXISTS "plan_request" JSONB;

-- 6. Links between tables
DO $$ BEGIN
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_payment_order_id_fkey"
    FOREIGN KEY ("payment_order_id") REFERENCES "payment_orders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "bookings" ADD CONSTRAINT "bookings_subscription_id_fkey"
    FOREIGN KEY ("subscription_id") REFERENCES "subscriptions"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;
DO $$ BEGIN
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_user_id_fkey"
    FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- 7. Existing bookings: mark the ones paid online as PAID (the rest stay UNPAID)
UPDATE "bookings" b SET "payment_status" = 'PAID'
WHERE b."payment_status" = 'UNPAID'
  AND EXISTS (SELECT 1 FROM "payments" p WHERE p."booking_id" = b."id" AND p."status" = 'Success');

COMMIT;
