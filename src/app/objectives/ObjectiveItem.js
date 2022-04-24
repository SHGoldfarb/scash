import React, { useState } from "react";
import { number } from "prop-types";
import { useHistory } from "react-router-dom";
import { useData } from "hooks";
import { DelayedCircularProgress } from "components";
import { makePath, objectivePathName } from "utils";
import { Item } from "./components";
import { EditAmountDialog } from "./objective-item";

const ObjectiveItem = ({ objectiveId, amount }) => {
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);

  const { dataHash: objectivesHash = {}, upsert, loading } = useData(
    "objectives"
  );

  const history = useHistory();

  const handleUpdate = async (newObjective) => {
    await upsert(newObjective);
  };

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const objective = objectivesHash[objectiveId];

  if (objective.closedAt && amount === 0) {
    return null;
  }

  return (
    <>
      {amountDialogOpen ? (
        <EditAmountDialog
          onClose={() => setAmountDialogOpen(false)}
          open
          onAmountChange={(amountChange) =>
            handleUpdate({
              ...objective,
              assignedAmount: objective.assignedAmount + amountChange,
            })
          }
        />
      ) : null}

      <Item
        label={objective.name}
        amount={amount}
        onAmountClick={() => !objective.closedAt && setAmountDialogOpen(true)}
        onLabelClick={() => {
          history.push(
            makePath(objectivePathName, {
              params: { id: objective.id },
            })
          );
        }}
        closed={!!objective.closedAt}
      />
    </>
  );
};

ObjectiveItem.propTypes = {
  objectiveId: number.isRequired,
  amount: number.isRequired,
};

export default ObjectiveItem;
