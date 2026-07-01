const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function fix() {
  await prisma.customPaymentLink.update({
    where: { id: "cmr29pnch0000kuockuz9yu8x" },
    data: { status: "SUCCESS" },
  });
  console.log("Fixed new link!");
}

fix().finally(() => prisma.$disconnect());
