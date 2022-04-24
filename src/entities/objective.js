import { DateTime } from "luxon";
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

export const isObjectiveClosed = (objective) => !!objective.closedAt;

export const isObjectiveOpen = (objective) => !isObjectiveClosed(objective);

export const closeObjective = (objective) => ({
  ...objective,
  closedAt: DateTime.local().toSeconds(),
});

export const restoreObjective = (objective) => ({
  ...objective,
  closedAt: null,
});
