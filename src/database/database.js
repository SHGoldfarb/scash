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

export default db;
