import { throwError } from "../lib";

export const validObjective = (data) => ({
  name:
    data.name ||
    throwError(
      TypeError,
      `Objective must have a name: ${JSON.stringify(data, null, 2)}`
    ),
  closedAt: data.closedAt || null,
  assignedAmount: data.assignedAmount || 0,
});
