const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const paymentOrder = await prisma.paymentOrder.findUnique({
    where: { id: "cmr286zms0002kun8a1t56m85" },
  });
  console.log("Found Order:", paymentOrder);
}

check().finally(() => prisma.$disconnect());
