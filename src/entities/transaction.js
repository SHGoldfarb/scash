import {
  isString,
  oneOfOrNull,
  throwError,
  throwInvalidEntityError,
} from "utils";

export const validTransactionTypes = ["income", "expense", "transfer"];

export const isValidTransactionType = (type) =>
  validTransactionTypes.includes(type);

export const validTransaction = (data) => ({
  amount: Number.isInteger(data.amount)
    ? data.amount
    : throwInvalidEntityError(data, "Transaction must include amount"),
  comment: isString(data.comment)
    ? data.comment
    : throwInvalidEntityError(data, "Transaction must include a comment"),
  date:
    data.date ||
    throwError(
      TypeError,
      `Transaction must include a date: ${JSON.stringify(data, null, 2)}`
    ),
  type: isValidTransactionType(data.type)
    ? data.type
    : throwInvalidEntityError(data, "Transaction must include a comment"),
  accountId: ["income", "expense"].includes(data.type)
    ? data.accountId ||
      throwError(
        TypeError,
        `Transaction must include an accountId: ${JSON.stringify(
          data,
          null,
          2
        )}`
      )
    : null,
  originAccountId:
    data.type === "transfer"
      ? data.originAccountId ||
        throwError(
          TypeError,
          `Transaction must include an originAccountId: ${JSON.stringify(
            data,
            null,
            2
          )}`
        )
      : null,
  destinationAccountId:
    data.type === "transfer"
      ? data.destinationAccountId ||
        throwError(
          TypeError,
          `Transaction must include a destinationAccountId: ${JSON.stringify(
            data,
            null,
            2
          )}`
        )
      : null,
  categoryId: oneOfOrNull(["income", "expense"])(data.type)
    ? data.categoryId ||
      throwError(
        TypeError,
        `Transaction must include a categoryId: ${JSON.stringify(
          data,
          null,
          2
        )}`
      )
    : null,
});
