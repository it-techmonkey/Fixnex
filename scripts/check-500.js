const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const order = await prisma.paymentOrder.findUnique({
    where: { id: "cmr29tn350002kuocrphnj60m" },
  });
  console.log("Order for 500 AED:", order);
}

check().finally(() => prisma.$disconnect());
