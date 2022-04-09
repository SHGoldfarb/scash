import Dexie from "dexie";
import { DateTime } from "luxon";

const db = new Dexie("myDb");
db.version(1).stores({
  accounts: `++id`,
});
db.version(2).stores({
  accounts: `++id`,
  categories: "++id",
});
db.version(3).stores({
  accounts: `++id`,
  categories: "++id",
  transactions: "++id",
});

db.version(4).upgrade(async (tx) => {
  return tx.transactions.bulkPut(
    (await tx.transactions.toArray()).map((transaction) => ({
      ...transaction,
      date: transaction.date || DateTime.local().toSeconds(),
    }))
  );
});

db.version(5).stores({
  accounts: `++id`,
  categories: "++id",
  transactions: "++id",
  incomeCategories: "++id",
});

db.version(6).upgrade(async (tx) => {
  return tx.transactions.clear();
});

db.version(7).upgrade(async (tx) => {
  return tx.transactions.clear();
});

db.version(8).upgrade(async (tx) => {
  return tx.transactions.clear();
});

db.version(9).upgrade(async (tx) => {
  await tx.categories.bulkPut(
    (await tx.categories.toArray()).map((category) => ({
      ...category,
      closedAt: category.deactivatedAt,
    }))
  );

  await tx.incomeCategories.bulkPut(
    (await tx.incomeCategories.toArray()).map((incomeCategory) => ({
      ...incomeCategory,
      closedAt: incomeCategory.deactivatedAt,
    }))
  );

  await tx.accounts.bulkPut(
    (await tx.accounts.toArray()).map((account) => ({
      ...account,
      closedAt: account.deactivatedAt,
    }))
  );
});

export default db;
