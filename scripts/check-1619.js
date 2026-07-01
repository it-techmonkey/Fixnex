const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const order = await prisma.paymentOrder.findUnique({
    where: { id: "cmr2a4tqc0005kuocx6fitn0i" },
  });
  console.log("Order from 16:19:", order);
}

check().finally(() => prisma.$disconnect());
