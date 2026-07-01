const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function cleanTestData() {
  console.log("Cleaning test data...");

  // 1. Delete all Payments
  const deletedPayments = await prisma.payment.deleteMany({});
  console.log(`Deleted ${deletedPayments.count} payments.`);

  // 2. Delete all PaymentOrders
  const deletedOrders = await prisma.paymentOrder.deleteMany({});
  console.log(`Deleted ${deletedOrders.count} payment orders.`);

  // 3. Delete all CustomPaymentLinks
  const deletedLinks = await prisma.customPaymentLink.deleteMany({});
  console.log(`Deleted ${deletedLinks.count} custom payment links.`);

  // Optional: If they also want blank phantom bookings deleted, we can delete bookings that have no cart items
  // but let's stick to the payment tables for now.

  console.log("Database payment tables are now clean!");
}

cleanTestData()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
