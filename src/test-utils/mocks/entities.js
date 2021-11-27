import { newId } from "./utils";

const makeEntityMock = (defaultAttributes) => (customAttributes = {}) => {
  const id = customAttributes.id || newId();
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
  type: ["expense", "income", "transfer"][id % 3],
  accountId: newId(),
  originAccountId: newId(),
  destinationAccountId: newId(),
  categoryId: newId(),
}));

export const categoryMock = makeEntityMock((id) => ({ name: `Category${id}` }));

export const accountMock = makeEntityMock((id) => ({ name: `Account${id}` }));
