const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function check() {
  const latestOrder = await prisma.paymentOrder.findFirst({
    orderBy: { created_at: 'desc' }
  });
  console.log("Latest Order:", latestOrder);

  const latestPayment = await prisma.payment.findFirst({
    orderBy: { created_at: 'desc' }
  });
  console.log("Latest Payment:", latestPayment);
}

check();
