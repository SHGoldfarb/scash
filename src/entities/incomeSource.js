import { throwError } from "../lib";

export const validIncomeSource = (data) => ({
  name:
    data.name ||
    throwError(
      TypeError,
      `IncomeSource must have a name: ${JSON.stringify(data, null, 2)}`
    ),
  closedAt: data.closedAt || null,
});
