import { throwError } from "../lib";

export const validCategory = (data) => ({
  name:
    data.name ||
    throwError(
      TypeError,
      `Category must have a name: ${JSON.stringify(data, null, 2)}`
    ),
  deactivatedAt: data.deactivatedAt || null,
});
