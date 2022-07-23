import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "components";
import { MenuItem } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { useFormIncomeSources } from "./hooks";
import { transactionTypes } from "../../../entities";

const IncomeSourceField = () => {
  const { availableIncomeSources, loading } = useFormIncomeSources();
  const { register, watch } = useFormContext();
  const [open, setOpen] = useState(false);

  const prevFieldValue = watch("accountId");
  const value = watch("incomeSourceId");

  useEffect(() => {
    if (prevFieldValue && !value) {
      setOpen(true);
    }
  }, [prevFieldValue, value]);

  if (watch("type") !== transactionTypes.income) {
    return null;
  }

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const { name, ref, onBlur, onChange } = register("incomeSourceId");

  return (
    <TextField
      select
      label="Income Source"
      variant="filled"
      id="transaction-income-source"
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
      {availableIncomeSources.map((incomeSource) => (
        <MenuItem value={incomeSource.id} key={incomeSource.id}>
          {incomeSource.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default IncomeSourceField;
