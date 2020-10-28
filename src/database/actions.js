import db from "./database";
import validators from "./validators";

export const getAll = async (tableName) =>
  (await db.table(tableName).toArray()).map(validators(tableName));

export const getById = async (tableName, id) =>
  validators(tableName)(await db.table(tableName).get({ id }));

export const upsert = (tableName, newData) => db.table(tableName).put(newData);

export const remove = (tableName, id) => db.table(tableName).delete(id);
