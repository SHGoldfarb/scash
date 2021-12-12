import React from "react";
import { func, shape, string } from "prop-types";
import { TextField } from "@mui/material";

const AmountField = ({ errors, register }) => {
  const { onChange, onBlur, name, ref } = register("amount", {
    pattern: /[0-9]*/,
    required: true,
  });
  return (
    <TextField
      variant="filled"
      label="Amount"
      type="number"
      required
      error={!!errors.amount}
      helperText={errors.amount ? "Enter a number" : ""}
      inputRef={ref}
      id="transaction-amount"
      fullWidth
      inputProps={{ autoFocus: true }}
      onChange={onChange}
      onBlur={onBlur}
      name={name}
    />
  );
};

AmountField.propTypes = {
  errors: shape({ amount: string }).isRequired,
  register: func.isRequired,
};

export default AmountField;
