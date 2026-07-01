/**
 * Seed a regular test user for CCAvenue payment testing.
 *
 * Run: node scripts/seed-test-user.js
 *
 * Test account credentials:
 *   Email   : test@fixnex.com
 *   Password: Test@1234
 */

const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

require("dotenv").config();

const prisma = new PrismaClient();

const TEST_EMAIL = "test@fixnex.com";
const TEST_PASSWORD = "Test@1234";
const TEST_FULL_NAME = "Test User";
const TEST_PHONE = "+971501234567";

async function seedTestUser() {
  const existing = await prisma.user.findUnique({ where: { email: TEST_EMAIL } });

  if (existing) {
    console.log(`Test user already exists: ${TEST_EMAIL}`);
    console.log("Password:", TEST_PASSWORD);
    return;
  }

  const passwordHash = await bcrypt.hash(TEST_PASSWORD, 12);

  const user = await prisma.user.create({
    data: {
      email: TEST_EMAIL,
      passwordHash,
      fullName: TEST_FULL_NAME,
      phoneNumber: "501234567",
      countryCode: "+971",
      role: "USER",
    },
  });

  // Create the user's cart (required before adding services)
  await prisma.cart.create({
    data: { user_id: user.id },
  });

  console.log("✅ Test user created successfully!");
  console.log("───────────────────────────────────");
  console.log("  Email   :", TEST_EMAIL);
  console.log("  Password:", TEST_PASSWORD);
  console.log("  Phone   :", TEST_PHONE);
  console.log("  Role    : USER");
  console.log("───────────────────────────────────");
  console.log("Login at: http://localhost:3000/login");
}

seedTestUser()
  .catch((e) => {
    console.error("Failed to seed test user:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
