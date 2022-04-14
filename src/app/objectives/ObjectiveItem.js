import React from "react";
import { number } from "prop-types";
import { DateTime } from "luxon";
import { useReadData, useWriteData } from "hooks";
import { DelayedCircularProgress } from "components";
import { upsertById } from "utils";
import { Item } from "./components";

const ObjectiveItem = ({ objectiveId, amount }) => {
  const { dataHash: objectivesHash = {}, update, loading } = useReadData(
    "objectives"
  );
  const { upsert } = useWriteData("objectives");

  const handleUpdate = async (newObjective) => {
    const returnedObjective = await upsert(newObjective);
    update((objectives) => upsertById(objectives, returnedObjective));
  };

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const objective = objectivesHash[objectiveId];

  if (objective.closedAt && amount === 0) {
    return null;
  }

  return (
    <Item
      label={objective.name}
      amount={amount}
      onNameChange={(newName) => handleUpdate({ ...objective, name: newName })}
      onClose={() => handleUpdate({ ...objective, closedAt: DateTime.local() })}
      onOpen={() => handleUpdate({ ...objective, closedAt: undefined })}
      closed={!!objective.closedAt}
      onAmountChange={(amountChange) =>
        handleUpdate({
          ...objective,
          assignedAmount: objective.assignedAmount + amountChange,
        })
      }
    />
  );
};

ObjectiveItem.propTypes = {
  objectiveId: number.isRequired,
  amount: number.isRequired,
};

export default ObjectiveItem;
