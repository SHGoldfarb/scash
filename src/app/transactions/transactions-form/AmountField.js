import React, { useEffect, useRef } from "react";
import { TextField } from "@mui/material";
import { transactionTypes } from "src/entities";
import { useTransactionFormContext } from "../contexts";

const name = "amount";

const AmountField = () => {
  const {
    values: {
      type,
      destinationAccountId,
      incomeSourceId,
      objectiveId,
      originAccountId,
      accountId,
      amount,
    },
    setField,
  } = useTransactionFormContext();

  const ref = useRef(null);

  const prevFieldsCompleted =
    (type === transactionTypes.transfer &&
      destinationAccountId &&
      originAccountId) ||
    (type === transactionTypes.income && incomeSourceId && accountId) ||
    (type === transactionTypes.expense && objectiveId && accountId) ||
    null;

  useEffect(() => {
    if (prevFieldsCompleted && !amount) {
      ref.current.focus();
    }
  }, [prevFieldsCompleted, amount]);

  return (
    <TextField
      variant="filled"
      label="Amount"
      type="number"
      required
      value={amount || ""}
      inputRef={ref}
      id="transaction-amount"
      fullWidth
      onChange={(e) => setField(name)(e.target.value)}
      name={name}
    />
  );
};

export default AmountField;
