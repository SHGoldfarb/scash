import React, { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { TextField } from "src/components";
import { useTransactionFormContext } from "../contexts";

const name = "type";

const TypeField = () => {
  const {
    values: { type },
    setField,
  } = useTransactionFormContext();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!type) {
      setOpen(true);
    }
  }, [type]);

  return (
    <TextField
      select
      label="Type"
      variant="filled"
      name={name}
      id={`transaction-${name}`}
      fullWidth
      value={type || ""}
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
      {/* TODO: This should be an enum */}
      <MenuItem value="expense">Expense</MenuItem>
      <MenuItem value="income">Income</MenuItem>
      <MenuItem value="transfer">Transfer</MenuItem>
    </TextField>
  );
};

export default TypeField;
