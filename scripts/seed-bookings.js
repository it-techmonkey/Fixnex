const { PrismaClient, BookingStatus } = require("@prisma/client");

require("dotenv").config();

const prisma = new PrismaClient();

const seedBookings = [
  {
    id: "seed-booking-pressure-wash",
    category_name: "Exterior Cleaning",
    location: "Dubai Marina, Dubai",
    service_type: "Pressure washing for outdoor areas",
    scheduled_date: new Date("2025-11-08T19:00:00.000Z"),
    time_slot: "19:00",
    price: "249.00",
    status: BookingStatus.CONFIRMED,
  },
  {
    id: "seed-booking-water-tank",
    category_name: "Utility Maintenance",
    location: "Jumeirah Beach Residence, Dubai",
    service_type: "Water tank cleaning / Water tank & drainage cleaning",
    scheduled_date: new Date("2025-11-08T21:00:00.000Z"),
    time_slot: "21:00",
    price: "189.00",
    status: BookingStatus.PENDING,
  },
  {
    id: "seed-booking-monthly-detail",
    category_name: "Marine Services",
    location: "Dubai Harbour, Dubai",
    service_type: "Monthly wash/detail (per ft/month)",
    scheduled_date: new Date("2025-11-08T20:00:00.000Z"),
    time_slot: "20:00",
    price: "499.00",
    status: BookingStatus.CONFIRMED,
  },
  {
    id: "seed-booking-gypsum-ceiling",
    category_name: "Interior Works",
    location: "Business Bay, Dubai",
    service_type: "Gypsum & ceiling works / Gypsum works & ceiling maintenance",
    scheduled_date: new Date("2025-11-08T19:00:00.000Z"),
    time_slot: "19:00",
    price: "349.00",
    status: BookingStatus.ONGOING,
  },
  {
    id: "seed-booking-ac-service",
    category_name: "HVAC Services",
    location: "Palm Jumeirah, Dubai",
    service_type: "AC servicing & repair / AC servicing, repair, and duct cleaning",
    scheduled_date: new Date("2025-11-08T19:00:00.000Z"),
    time_slot: "19:00",
    price: "299.00",
    status: BookingStatus.CONFIRMED,
  },
];

async function main() {
  console.log("Seeding bookings...");

  const seededIds = [];

  await prisma.$transaction(async (tx) => {
    for (const booking of seedBookings) {
      const { id, ...data } = booking;

      const result = await tx.booking.upsert({
        where: { id },
        create: { id, ...data },
        update: data,
      });

      seededIds.push(result.id);
    }
  });

  const count = seededIds.length;
  console.log(`Successfully ensured ${count} booking${count === 1 ? "" : "s"} are in the database.`);
}

main()
  .catch((error) => {
    console.error("Failed to seed bookings:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });


