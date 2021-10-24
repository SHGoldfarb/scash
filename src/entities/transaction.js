import { oneOfOrNull, throwError } from "utils";

export const validTransaction = (data) => ({
  amount: data.amount ? parseInt(data.amount, 10) : 0,
  comment: data.comment || "",
  date:
    data.date ||
    throwError(
      TypeError,
      `Transaction must include a date: ${JSON.stringify(data, null, 2)}`
    ),
  type: oneOfOrNull(["income", "expense", "transfer"])(data.type) || "expense",
  accountId: oneOfOrNull(["income", "expense"])(data.type)
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
          `Transaction must include an destinationAccountId: ${JSON.stringify(
            data,
            null,
            2
          )}`
        )
      : null,
});
