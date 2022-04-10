import { newId, sample } from "utils";

const words = "lorem ipsum dolor sit amet consectetur adipiscing elit praesent pellentesque turpis ut enim consequat at vestibulum felis viverra pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas nulla vitae justo condimentum rutrum sapien a congue magna duis vitae quam a metus rutrum venenatis et ut odio phasellus blandit leo erat sed vehicula lorem consectetur a suspendisse et vehicula urna proin purus massa hendrerit non tristique ac varius ut elit".split(
  " "
);

const makeEntityMock = (defaultAttributes) => (customAttributes = {}) => {
  const id = customAttributes.id || newId();
  return {
    ...defaultAttributes(id),
    ...customAttributes,
    id,
  };
};

export const transactionMock = makeEntityMock((id) => ({
  comment: `${sample(words)} ${sample(words)}${id} ${sample(words)}`,
  date: 1604767791 + id * 60,
  amount: 5000 + id,
  type: ["expense", "income", "transfer"][id % 3],
  accountId: newId(),
  originAccountId: newId(),
  destinationAccountId: newId(),
  categoryId: newId(),
}));

export const categoryMock = makeEntityMock((id) => ({
  name: `Category${id}`,
  closedAt: undefined,
  assignedAmount: 0,
}));

export const accountMock = makeEntityMock((id) => ({ name: `Account${id}` }));
