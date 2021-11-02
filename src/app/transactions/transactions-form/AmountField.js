import React from "react";
import { func, shape, string } from "prop-types";
import { TextField } from "@material-ui/core";

const AmountField = ({ errors, register }) => {
  return (
    <TextField
      variant="filled"
      label="Amount"
      name="amount"
      type="number"
      required
      error={!!errors.amount}
      helperText={errors.amount ? "Enter a number" : ""}
      inputRef={register({ pattern: /[0-9]*/, required: true })}
      id="transaction-amount"
      fullWidth
      inputProps={{ autoFocus: true }}
    />
  );
};

AmountField.propTypes = {
  errors: shape({ amount: string }).isRequired,
  register: func.isRequired,
};

export default AmountField;
