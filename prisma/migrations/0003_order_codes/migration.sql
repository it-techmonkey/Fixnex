-- Readable order ID (e.g. FNX-AC-1001) for successful payment orders. Existing rows keep NULL.
ALTER TABLE "payment_orders" ADD COLUMN "order_code" TEXT;
CREATE UNIQUE INDEX "payment_orders_order_code_key" ON "payment_orders"("order_code");
