import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "src/components";
import { MenuItem } from "@mui/material";
import { transactionTypes } from "src/entities";
import { useFormObjectives } from "./hooks";
import { useTransactionFormContext } from "../contexts";

const name = "objectiveId";

const ObjectiveField = () => {
  const { availableObjectives, loading } = useFormObjectives();

  const {
    values: { accountId, objectiveId, type },
    setField,
  } = useTransactionFormContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (accountId && !objectiveId) {
      setOpen(true);
    }
  }, [accountId, objectiveId]);

  if (type !== transactionTypes.expense) {
    return null;
  }

  if (loading) {
    return <DelayedCircularProgress />;
  }

  return (
    <TextField
      select
      label="Objective"
      variant="filled"
      id="transaction-objective"
      fullWidth
      name={name}
      value={objectiveId || ""}
      onChange={(e) => setField(name)(e.target.value)}
      SelectProps={{
        open,
        onClose: () => {
          setOpen(false);
        },
        onOpen: () => {
          setOpen(true);
        },
      }}
    >
      {availableObjectives.map((objective) => (
        <MenuItem value={objective.id} key={objective.id}>
          {objective.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default ObjectiveField;
