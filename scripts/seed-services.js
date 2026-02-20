const fs = require("fs/promises");
const path = require("path");
const { PrismaClient } = require("@prisma/client");

/**
 * @typedef {Object} ServiceEntry
 * @property {string} name
 * @property {string|number} normal_price
 * @property {string|number} member_price
 * @property {string} icon
 */

/**
 * @typedef {Object} CategoryEntry
 * @property {string} category
 * @property {ServiceEntry[]} services
 */

const prisma = new PrismaClient();

const toPriceString = (value) => {
  if (typeof value === "number") {
    return value.toString();
  }
  return value;
};

/**
 * @param {CategoryEntry[]} data
 */
async function seedServices(data) {
  for (const entry of data) {
    const category = await prisma.serviceCategory.upsert({
      where: { name: entry.category },
      update: {},
      create: { name: entry.category },
    });

    for (const service of entry.services) {
      await prisma.service.upsert({
        where: {
          name_category_id: {
            name: service.name,
            category_id: category.id,
          },
        },
        update: {
          normal_price: toPriceString(service.normal_price),
          member_price: toPriceString(service.member_price),
          icon: service.icon,
        },
        create: {
          name: service.name,
          normal_price: toPriceString(service.normal_price),
          member_price: toPriceString(service.member_price),
          icon: service.icon,
          category_id: category.id,
        },
      });
    }
  }
}

async function main() {
  const filePath = path.resolve(process.cwd(), "app/db/service.json");
  const fileContents = await fs.readFile(filePath, "utf-8");
  const payload = JSON.parse(fileContents);

  await seedServices(payload);
}

main()
  .then(() => {
    console.log("Service categories and services seeded successfully.");
  })
  .catch((error) => {
    console.error("Failed to seed services:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

