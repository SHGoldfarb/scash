import { throwError } from "utils";

export const validAccount = (data) => ({
  name:
    data.name ||
    throwError(
      TypeError,
      `Account must have a name: ${JSON.stringify(data, null, 2)}`
    ),
  deactivatedAt: data.deactivatedAt || null,
});
