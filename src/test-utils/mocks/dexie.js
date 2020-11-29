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

const makeEntityMock = (defaultAttributes) => (customAttributes) => {
  const id = newId();
  return {
    ...defaultAttributes(id),
    ...customAttributes,
    id,
  };
};

export const transactionMock = makeEntityMock((id) => ({
  comment: `Comment${id} for ${id}`,
  date: 1604767791 + id * 60,
  amount: 5000 + id,
  type: "expense",
}));

export const categoryMock = makeEntityMock((id) => ({ name: `Category${id}` }));

export const accountMock = makeEntityMock((id) => ({ name: `Account${id}` }));
