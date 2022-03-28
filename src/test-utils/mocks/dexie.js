import { asyncReduce, upsertById } from "utils";
import { newId } from "./utils";

let mockDatabase;
beforeEach(() => {
  mockDatabase = {};
});

const put = (tableName) =>
  jest.fn(async (item) => {
    if (!mockDatabase[tableName]) {
      mockDatabase[tableName] = [];
    }
    const safeId = item.id || newId();
    mockDatabase[tableName] = upsertById(mockDatabase[tableName], {
      ...item,
      id: safeId,
    });

    return safeId;
  });

const remove = (tableName) =>
  jest.fn(async (idToRemove) => {
    if (!mockDatabase[tableName]) {
      mockDatabase[tableName] = [];
    }

    const item = mockDatabase[tableName].filter(
      ({ id }) => idToRemove === id
    )[0];

    mockDatabase[tableName] = mockDatabase[tableName].filter(
      ({ id }) => id !== idToRemove
    );

    return item;
  });

const get = (tableName) =>
  jest.fn(
    async ({ id }) =>
      mockDatabase[tableName].filter(
        ({ id: existingId }) => existingId === id
      )[0]
  );

const set = (tableName) =>
  jest.fn((items) => {
    mockDatabase[tableName] = items;
  });

const clear = (tableName) =>
  jest.fn(async () => {
    mockDatabase[tableName] = [];

    return null;
  });

const bulkAdd = (tableName) =>
  jest.fn(async (items) => {
    await asyncReduce(items.map((item) => () => put(tableName)(item)));
    return null;
  });

export const mockTable = (tableName) => ({
  toArray: async () => mockDatabase[tableName] || [],
  put: put(tableName),
  get: get(tableName),
  delete: remove(tableName),
  set: set(tableName),
  clear: clear(tableName),
  bulkAdd: bulkAdd(tableName),
});
