import { upsertById } from "utils";
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

export const mockTable = (tableName) => ({
  toArray: async () => mockDatabase[tableName] || [],
  put: put(tableName),
  get: get(tableName),
  set: set(tableName),
});

export const transactionMock = () => {
  const id = newId();
  return {
    id,
    comment: `Comment${id} for ${id}`,
    date: 1604767791 + id * 60,
    amount: 5000 + id,
    type: "expense",
  };
};

export const categoryMock = () => {
  const id = newId();
  return {
    id,
    name: `Category${id}`,
  };
};

export const accountMock = () => {
  const id = newId();
  return {
    id,
    name: `Account${id}`,
  };
};
