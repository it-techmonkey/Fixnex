-- Readable IDs for new customers and bookings. Existing rows keep NULL codes.
ALTER TABLE "users" ADD COLUMN "customer_code" TEXT;
CREATE UNIQUE INDEX "users_customer_code_key" ON "users"("customer_code");

ALTER TABLE "bookings" ADD COLUMN "booking_code" TEXT;
CREATE UNIQUE INDEX "bookings_booking_code_key" ON "bookings"("booking_code");

CREATE TABLE "id_counters" (
    "key" TEXT NOT NULL,
    "value" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "id_counters_pkey" PRIMARY KEY ("key")
);
