const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.customPaymentLink.update({
    where: { id: "cmr2a4aaf0003kuoc5el0xl9v" },
    data: { status: "SUCCESS" },
  });
  console.log("Fixed 100 AED link!");
}

fix().finally(() => prisma.$disconnect());
