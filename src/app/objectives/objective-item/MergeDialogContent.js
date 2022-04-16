import React, { useState } from "react";
import { number, func } from "prop-types";
import { useData } from "hooks";
import { DelayedCircularProgress } from "components";
import {
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const MergeDialogContent = ({ onClose, objectiveId }) => {
  const {
    loading: objectivesLoading,
    data: objectives = [],
    dataHash: objectivesHash = {},
    upsert: upsertObjective,
    remove: removeObjective,
  } = useData("objectives");

  const {
    loading: transactionsLoading,
    data: transactions = [],
    set: setTransactions,
  } = useData("transactions");

  const [selectedObjectiveId, setSelectedObjectiveId] = useState("");

  const objectiveToRemove = objectivesHash[objectiveId];
  const selectedObjective = objectivesHash[selectedObjectiveId];

  const availableObjectives = objectives.filter(
    (obj) => !obj.closedAt && obj.id !== objectiveId
  );

  const handleMerge = async () => {
    onClose();
    // Update transactions to new objective id
    await setTransactions(
      transactions.map((transaction) => ({
        ...transaction,
        objectiveId:
          transaction.objectiveId === objectiveId
            ? selectedObjectiveId
            : transaction.objectiveId,
      }))
    );

    // Sum assigned amounts and assign to new objective
    await upsertObjective({
      ...selectedObjective,
      assignedAmount:
        selectedObjective.assignedAmount + objectiveToRemove.assignedAmount,
    });

    // Remove old objective
    await removeObjective(objectiveId);
  };

  if (objectivesLoading || transactionsLoading)
    return <DelayedCircularProgress />;

  return (
    <>
      <DialogTitle>Merge Objective</DialogTitle>
      <DialogContent>
        <FormControl fullWidth>
          <InputLabel id={`merge-objective-${objectiveId}`}>
            Merge into
          </InputLabel>
          <Select
            id={`merge-objective-${objectiveId}`}
            value={selectedObjectiveId}
            onChange={(ev) => setSelectedObjectiveId(ev.target.value)}
          >
            {availableObjectives.map((obj) => (
              <MenuItem key={obj.id} value={obj.id}>
                {obj.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>

      <DialogActions>
        <Button onClick={handleMerge}>Save</Button>
      </DialogActions>
    </>
  );
};

MergeDialogContent.propTypes = {
  objectiveId: number.isRequired,
  onClose: func.isRequired,
};

export default MergeDialogContent;
