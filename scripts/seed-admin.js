const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const prisma = new PrismaClient();

// Credentials come from the environment so no default password lives in the repo.
//   ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='a-strong-password' npm run seed:admin
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@fixnex.com").trim().toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "";
const ADMIN_FULL_NAME = "Fixnex Admin";

if (ADMIN_PASSWORD.length < 8 || !/[A-Za-z]/.test(ADMIN_PASSWORD) || !/\d/.test(ADMIN_PASSWORD)) {
  console.error("Set ADMIN_PASSWORD (at least 8 characters, with a letter and a number) and run again.");
  process.exit(1);
}

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
  console.log("Sign in with the ADMIN_PASSWORD you provided, then change it from Admin > Account.");
}

seedAdmin()
  .catch((e) => {
    console.error("Failed to seed admin:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
