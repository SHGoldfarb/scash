import React, { useEffect, useState } from "react";
import { MenuItem } from "@mui/material";
import { TextField } from "components";
import { useFormContext } from "react-hook-form";

const TypeField = () => {
  const { register, watch } = useFormContext();
  const { name, onChange, onBlur, ref } = register("type");
  const [open, setOpen] = useState(false);

  const transactionDate = watch("date");
  const value = watch("type");

  useEffect(() => {
    if (transactionDate && !value) {
      setOpen(true);
    }
  }, [transactionDate, value]);

  return (
    <TextField
      select
      label="Type"
      variant="filled"
      name={name}
      id={`transaction-${name}`}
      fullWidth
      defaultValue=""
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
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
