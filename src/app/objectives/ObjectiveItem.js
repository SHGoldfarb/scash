import React, { useState } from "react";
import { number } from "prop-types";
import { DateTime } from "luxon";
import { useData } from "hooks";
import { DelayedCircularProgress } from "components";
import { Dialog } from "@mui/material";
import { Item } from "./components";
import {
  EditAmountDialog,
  EditNameDialog,
  MergeDialogContent,
} from "./objective-item";

const ObjectiveItem = ({ objectiveId, amount }) => {
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false);

  const { dataHash: objectivesHash = {}, upsert, loading } = useData(
    "objectives"
  );

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

      {nameDialogOpen ? (
        <EditNameDialog
          onClose={() => setNameDialogOpen(false)}
          open
          deleted={!!objective.closedAt}
          onNameChange={(newName) =>
            handleUpdate({ ...objective, name: newName })
          }
          onDelete={() =>
            handleUpdate({ ...objective, closedAt: DateTime.local() })
          }
          onRestore={() => handleUpdate({ ...objective, closedAt: undefined })}
          name={objective.name}
          canDelete={amount === 0}
          onMergeClick={() => setMergeDialogOpen(true)}
        />
      ) : null}
      <Dialog open={mergeDialogOpen} onClose={() => setMergeDialogOpen(false)}>
        <MergeDialogContent
          objectiveId={objectiveId}
          onClose={() => setMergeDialogOpen(false)}
        />
      </Dialog>
      <Item
        label={objective.name}
        amount={amount}
        onAmountClick={() => !objective.closedAt && setAmountDialogOpen(true)}
        onLabelClick={() => setNameDialogOpen(true)}
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
