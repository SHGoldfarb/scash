import { throwError } from "utils";

export const validIncomeCategory = (data) => ({
  name:
    data.name ||
    throwError(
      TypeError,
      `IncomeCategory must have a name: ${JSON.stringify(data, null, 2)}`
    ),
  deactivatedAt: data.deactivatedAt || null,
});
