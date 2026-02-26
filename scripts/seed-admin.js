const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const prisma = new PrismaClient();

const ADMIN_EMAIL = "admin@fixnex.com";
const ADMIN_PASSWORD = "Admin@123";
const ADMIN_FULL_NAME = "Fixnex Admin";

async function seedAdmin() {
  const existing = await prisma.user.findUnique({
    where: { email: ADMIN_EMAIL },
  });

  if (existing) {
    console.log(`Admin user already exists: ${ADMIN_EMAIL}`);
    return;
  }

  const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);
  const user = await prisma.user.create({
    data: {
      email: ADMIN_EMAIL,
      passwordHash,
      fullName: ADMIN_FULL_NAME,
      role: "ADMIN",
    },
  });

  await prisma.cart.create({
    data: {
      user_id: user.id,
    },
  });

  console.log("Admin user created successfully.");
  console.log("Email:", ADMIN_EMAIL);
  console.log("Password:", ADMIN_PASSWORD);
  console.log("(Change this password after first login in production.)");
}

seedAdmin()
  .catch((e) => {
    console.error("Failed to seed admin:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
