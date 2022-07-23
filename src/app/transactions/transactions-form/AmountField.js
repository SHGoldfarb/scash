import React, { useEffect } from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";
import { transactionTypes } from "../../../entities";

const AmountField = () => {
  const {
    register,
    setFocus,
    formState: { errors },
    watch,
  } = useFormContext();

  const transactionType = watch("type");
  const prevFieldValue =
    (transactionType === transactionTypes.transfer &&
      watch("destinationAccountId")) ||
    (transactionTypes.income && watch("incomeSourceId")) ||
    (transactionTypes.expense && watch("objectiveId")) ||
    null;
  const value = watch("amount");

  useEffect(() => {
    if (prevFieldValue && !value) {
      setFocus("amount");
    }
  }, [prevFieldValue, value, setFocus]);

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
      onChange={onChange}
      onBlur={onBlur}
      name={name}
    />
  );
};

export default AmountField;
