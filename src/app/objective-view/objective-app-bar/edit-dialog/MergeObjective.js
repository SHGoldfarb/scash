import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useData } from "hooks";
import { makePath, objectivesPathName } from "utils";
import { useCurrentObjective } from "../../hooks";
import { isObjectiveOpen } from "../../../../entities";

const MergeObjective = () => {
  const history = useHistory();

  const { objective, loading: currentObjectiveLoading } = useCurrentObjective();

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

  const selectedObjective = objectivesHash[selectedObjectiveId];

  const availableObjectives = objectives.filter(
    (obj) => isObjectiveOpen(obj) && obj.id !== objective.id
  );

  const handleMerge = async () => {
    // Update transactions to new objective id
    const { updateState: updateTransactions } = await setTransactions(
      transactions.map((transaction) => ({
        ...transaction,
        objectiveId:
          transaction.objectiveId === objective.id
            ? selectedObjectiveId
            : transaction.objectiveId,
      })),
      { lazyStateUpdate: true }
    );

    // Sum assigned amounts and assign to new objective
    const { updateState: updateSelectedObjective } = await upsertObjective(
      {
        ...selectedObjective,
        assignedAmount:
          selectedObjective.assignedAmount + objective.assignedAmount,
      },
      { lazyStateUpdate: true }
    );

    // Remove old objective
    const {
      updateState: updateRemovedObjective,
    } = await removeObjective(objective.id, { lazyStateUpdate: true });

    updateTransactions();
    updateSelectedObjective();
    updateRemovedObjective();

    history.push(makePath(objectivesPathName));
  };

  if (objectivesLoading || transactionsLoading || currentObjectiveLoading)
    return <DelayedCircularProgress />;

  const fieldId = `merge-objective-${objective.id}`;

  return (
    <>
      <FormControl fullWidth>
        <InputLabel id={fieldId}>Merge into</InputLabel>
        <Select
          id={fieldId}
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
      <Button onClick={handleMerge}>Save Merge</Button>
    </>
  );
};

export default MergeObjective;
