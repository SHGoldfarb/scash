import db from "./database";
import validators from "./validators";

export const getAll = async (tableName) =>
  (await db.table(tableName).toArray()).map(validators(tableName));

export const getById = async (tableName, id) =>
  validators(tableName)(await db.table(tableName).get({ id }));

export const upsert = (tableName, newData) =>
  db.table(tableName).put(validators(tableName)(newData));

export const remove = (tableName, id) => db.table(tableName).delete(id);

export const clear = (tableName) => db.table(tableName).clear();

export const bulkAdd = (tableName, items, options) =>
  db.table(tableName).bulkAdd(
    items.map((item) => validators(tableName)(item)),
    options
  );

export const bulkGet = async (tableName, ids) =>
  (await db.table(tableName).bulkGet(ids)).map(validators(tableName));
