import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config(); // Load environment variables

const prisma = new PrismaClient();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelMapping = {
  "products": "products",
  "expenseSummary": "expenseSummary",
  "sales": "sale",
  "salesSummary": "salesSummary",
  "purchases": "purchase",
  "purchaseSummary": "purchaseSummary",
  "users": "users",
  "salaries": "salaries",
  "expenses": "expenses",
  "expenseByCategory": "expenseByCategory",
};

const deleteOrder = [
  "sale",
  "purchase",
  "expenses",
  "salaries",
  "expenseByCategory",
  "expenseSummary",
  "salesSummary",
  "purchaseSummary",
  "products",
  "users",
];

async function deleteAllData() {
  for (const modelName of deleteOrder) {
    if (prisma[modelName]) {
      try {
        await prisma[modelName].deleteMany();
        console.log(`Deleted all data from ${modelName}`);
      } catch (error) {
        console.error(`Error deleting data from ${modelName}:`, error);
      }
    } else {
      console.warn(`Model ${modelName} not found in Prisma client`);
    }
  }
}

async function main() {
  const dataDirectory = path.resolve(__dirname, "seedData");
  const orderedFileNames = [
    "users.json",
    "products.json",
    "sales.json",
    "purchases.json",
    "expenseSummary.json",
    "salesSummary.json",
    "purchaseSummary.json",
    "salaries.json",
    "expenses.json",
    "expenseByCategory.json",
  ];

  console.log("Searching for seed data in:", dataDirectory);

  try {
    await deleteAllData();

    for (const fileName of orderedFileNames) {
      const filePath = path.join(dataDirectory, fileName);
      if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        continue;
      }
      const jsonData = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      const modelName = path.basename(fileName, path.extname(fileName));
      const prismaModelName = modelMapping[modelName];

      if (!prismaModelName || !prisma[prismaModelName]) {
        console.error(`No Prisma model matches the file name: ${fileName}`);
        continue;
      }

      for (const data of jsonData) {
        // Handle date fields
        if (data.timestamp) data.timestamp = new Date(data.timestamp);
        if (data.date) data.date = new Date(data.date);
        if (data.startDate) data.startDate = new Date(data.startDate);
        if (data.endDate) data.endDate = new Date(data.endDate);

        // Handle BigInt fields for ExpenseByCategory
        if (prismaModelName === 'expenseByCategory' && data.amount) {
          data.amount = BigInt(data.amount);
        }

        try {
          await prisma[prismaModelName].create({ data });
        } catch (error) {
          console.error(`Error seeding data for ${modelName}:`, error);
          console.error('Problematic data:', data);
        }
      }

      console.log(`Seeded ${modelName} with data from ${fileName}`);
    }
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });