const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.customPaymentLink.update({
    where: { id: "cmr27penn0000kun87w5c20q7" },
    data: { status: "SUCCESS" },
  });
  console.log("Fixed!");
}

fix().finally(() => prisma.$disconnect());
