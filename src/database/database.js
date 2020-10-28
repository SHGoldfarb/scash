import Dexie from "dexie";

const db = new Dexie("myDb");
db.version(1).stores({
  accounts: `++id`,
});
db.version(2).stores({
  accounts: `++id`,
  categories: "++id",
});

export default db;
