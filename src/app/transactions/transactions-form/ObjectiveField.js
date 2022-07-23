import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "components";
import { MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { transactionTypes } from "../../../entities";
import { useFormObjectives } from "./hooks";

const ObjectiveField = () => {
  const { availableObjectives, loading } = useFormObjectives();

  const { register, watch } = useFormContext();
  const [open, setOpen] = useState(false);

  const prevFieldValue = watch("accountId");
  const value = watch("objectiveId");

  useEffect(() => {
    if (prevFieldValue && !value) {
      setOpen(true);
    }
  }, [prevFieldValue, value]);

  if (watch("type") !== transactionTypes.expense) {
    return null;
  }

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const { name, ref, onBlur, onChange } = register("objectiveId");

  return (
    <TextField
      select
      label="Objective"
      variant="filled"
      id="transaction-objective"
      fullWidth
      name={name}
      inputRef={ref}
      onBlur={onBlur}
      onChange={onChange}
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
