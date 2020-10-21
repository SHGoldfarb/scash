import Dexie from "dexie";

const db = new Dexie("myDb");
db.version(1).stores({
  accounts: `++id`,
});

export default db;
