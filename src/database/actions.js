import db from "./database";

export const getAll = (tableName) => db.table(tableName).toArray();

export const getById = (tableName, id) => db.table(tableName).get({ id });

export const upsert = (tableName, newData) => db.table(tableName).put(newData);

export const remove = (tableName, id) => db.table(tableName).delete(id);
