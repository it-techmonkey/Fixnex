-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "countryCode" VARCHAR(8),
    "phoneNumber" VARCHAR(20),
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "services" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "normal_price" TEXT NOT NULL,
    "member_price" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "category_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "services_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_categories" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookings" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "category_name" TEXT,
    "location" TEXT,
    "service_type" TEXT,
    "scheduled_date" TIMESTAMP(3),
    "time_slot" TEXT,
    "price" TEXT,
    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "carts" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "carts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BookingCartItem" (
    "id" TEXT NOT NULL,
    "service_id" TEXT NOT NULL,
    "cart_id" TEXT NOT NULL,
    "category_name" TEXT,
    "location" TEXT,
    "service_type" TEXT,
    "scheduled_date" TIMESTAMP(3),
    "time_slot" TEXT,
    "price" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "booking_id" TEXT,

    CONSTRAINT "BookingCartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CartToService" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CartToService_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "services_name_category_id_key" ON "services"("name", "category_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_categories_name_key" ON "service_categories"("name");

-- CreateIndex
CREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");

-- CreateIndex
CREATE INDEX "_CartToService_B_index" ON "_CartToService"("B");

-- AddForeignKey
ALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCartItem" ADD CONSTRAINT "BookingCartItem_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCartItem" ADD CONSTRAINT "BookingCartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingCartItem" ADD CONSTRAINT "BookingCartItem_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToService" ADD CONSTRAINT "_CartToService_A_fkey" FOREIGN KEY ("A") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CartToService" ADD CONSTRAINT "_CartToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;
-- CreateEnumCREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN');-- CreateEnumCREATE TYPE "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'ONGOING', 'COMPLETED', 'CANCELLED', 'REJECTED');-- CreateTableCREATE TABLE "users" (    "id" TEXT NOT NULL,    "email" TEXT NOT NULL,    "passwordHash" TEXT NOT NULL,    "fullName" TEXT NOT NULL,    "countryCode" VARCHAR(8),    "phoneNumber" VARCHAR(20),    "role" "UserRole" NOT NULL DEFAULT 'USER',    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,    "updatedAt" TIMESTAMP(3) NOT NULL,    CONSTRAINT "users_pkey" PRIMARY KEY ("id"));-- CreateTableCREATE TABLE "services" (    "id" TEXT NOT NULL,    "name" TEXT NOT NULL,    "normal_price" TEXT NOT NULL,    "member_price" TEXT NOT NULL,    "icon" TEXT NOT NULL,    "category_id" TEXT NOT NULL,    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,    "updated_at" TIMESTAMP(3) NOT NULL,    CONSTRAINT "services_pkey" PRIMARY KEY ("id"));-- CreateTableCREATE TABLE "service_categories" (    "id" TEXT NOT NULL,    "name" TEXT NOT NULL,    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,    "updated_at" TIMESTAMP(3) NOT NULL,    CONSTRAINT "service_categories_pkey" PRIMARY KEY ("id"));-- CreateTableCREATE TABLE "bookings" (    "id" TEXT NOT NULL,    "user_id" TEXT,    "category_name" TEXT,    "location" TEXT,    "service_type" TEXT,    "scheduled_date" TIMESTAMP(3),    "time_slot" TEXT,    "price" TEXT,    "status" "BookingStatus" NOT NULL DEFAULT 'PENDING',    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,    "updated_at" TIMESTAMP(3) NOT NULL,    CONSTRAINT "bookings_pkey" PRIMARY KEY ("id"));-- CreateTableCREATE TABLE "carts" (    "id" TEXT NOT NULL,    "user_id" TEXT NOT NULL,    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,    "updated_at" TIMESTAMP(3) NOT NULL,    CONSTRAINT "carts_pkey" PRIMARY KEY ("id"));-- CreateTableCREATE TABLE "BookingCartItem" (    "id" TEXT NOT NULL,    "service_id" TEXT NOT NULL,    "cart_id" TEXT NOT NULL,    "category_name" TEXT,    "location" TEXT,    "service_type" TEXT,    "scheduled_date" TIMESTAMP(3),    "time_slot" TEXT,    "price" TEXT,    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,    "updated_at" TIMESTAMP(3) NOT NULL,    "booking_id" TEXT,    CONSTRAINT "BookingCartItem_pkey" PRIMARY KEY ("id"));-- CreateTableCREATE TABLE "_CartToService" (    "A" TEXT NOT NULL,    "B" TEXT NOT NULL,    CONSTRAINT "_CartToService_AB_pkey" PRIMARY KEY ("A","B"));-- CreateIndexCREATE UNIQUE INDEX "users_email_key" ON "users"("email");-- CreateIndexCREATE UNIQUE INDEX "services_name_category_id_key" ON "services"("name", "category_id");-- CreateIndexCREATE UNIQUE INDEX "service_categories_name_key" ON "service_categories"("name");-- CreateIndexCREATE INDEX "bookings_user_id_idx" ON "bookings"("user_id");-- CreateIndexCREATE UNIQUE INDEX "carts_user_id_key" ON "carts"("user_id");-- CreateIndexCREATE INDEX "_CartToService_B_index" ON "_CartToService"("B");-- AddForeignKeyALTER TABLE "services" ADD CONSTRAINT "services_category_id_fkey" FOREIGN KEY ("category_id") REFERENCES "service_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;-- AddForeignKeyALTER TABLE "bookings" ADD CONSTRAINT "bookings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;-- AddForeignKeyALTER TABLE "carts" ADD CONSTRAINT "carts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;-- AddForeignKeyALTER TABLE "BookingCartItem" ADD CONSTRAINT "BookingCartItem_service_id_fkey" FOREIGN KEY ("service_id") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;-- AddForeignKeyALTER TABLE "BookingCartItem" ADD CONSTRAINT "BookingCartItem_cart_id_fkey" FOREIGN KEY ("cart_id") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;-- AddForeignKeyALTER TABLE "BookingCartItem" ADD CONSTRAINT "BookingCartItem_booking_id_fkey" FOREIGN KEY ("booking_id") REFERENCES "bookings"("id") ON DELETE CASCADE ON UPDATE CASCADE;-- AddForeignKeyALTER TABLE "_CartToService" ADD CONSTRAINT "_CartToService_A_fkey" FOREIGN KEY ("A") REFERENCES "carts"("id") ON DELETE CASCADE ON UPDATE CASCADE;-- AddForeignKeyALTER TABLE "_CartToService" ADD CONSTRAINT "_CartToService_B_fkey" FOREIGN KEY ("B") REFERENCES "services"("id") ON DELETE CASCADE ON UPDATE CASCADE;