const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const links = await prisma.customPaymentLink.findMany();
  console.log("Custom Links:");
  console.log(links);

  const orders = await prisma.paymentOrder.findMany();
  console.log("Payment Orders:");
  console.log(orders);

  const payments = await prisma.payment.findMany();
  console.log("Payments Ledger:");
  console.log(payments);
}

check().finally(() => prisma.$disconnect());
