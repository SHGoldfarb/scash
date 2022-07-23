import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "src/components";
import { MenuItem } from "@mui/material";
import { useFormIncomeSources } from "./hooks";
import { transactionTypes } from "src/entities";
import { useTransactionFormContext } from "../contexts";

const name = "incomeSourceId";

const IncomeSourceField = () => {
  const { availableIncomeSources, loading } = useFormIncomeSources();
  const {
    values: { accountId, type, incomeSourceId },
    setField,
  } = useTransactionFormContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (accountId && !incomeSourceId) {
      setOpen(true);
    }
  }, [accountId, incomeSourceId]);

  if (type !== transactionTypes.income) {
    return null;
  }

  if (loading) {
    return <DelayedCircularProgress />;
  }

  return (
    <TextField
      select
      label="Income Source"
      variant="filled"
      id="transaction-income-source"
      fullWidth
      name={name}
      value={incomeSourceId || ""}
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
      {availableIncomeSources.map((incomeSource) => (
        <MenuItem value={incomeSource.id} key={incomeSource.id}>
          {incomeSource.name}
        </MenuItem>
      ))}
    </TextField>
  );
};

export default IncomeSourceField;
