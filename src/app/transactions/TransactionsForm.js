import { Button, TextField } from "@material-ui/core";
import React, { forwardRef } from "react";
import { useHistory } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { DateTimePicker } from "@material-ui/pickers";
import { useReadData, useWriteData } from "../../hooks";
import { makePath, transactionsPathName } from "../../utils";

const dateDisplayFormat = "yyyy-MM-dd HH:mm";

const DateTimePickerWithRef = forwardRef((props, ref) => (
  <DateTimePicker {...props} inputRef={ref} />
));

const TransactionsForm = () => {
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();

  return (
    <>
      <TextField
        select
        SelectProps={{ native: true }}
        label="Type"
        variant="filled"
        name="type"
        inputRef={register}
        id="transaction-type"
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
        <option value="transfer">Transfer</option>
      </TextField>
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
      />
      <Controller
        as={DateTimePickerWithRef}
        control={control}
        inputVariant="filled"
        label="Date"
        name="date"
        format={dateDisplayFormat}
        defaultValue={DateTime.local()}
        id="transaction-date"
      />

      <TextField
        variant="filled"
        label="Comment"
        name="comment"
        inputRef={register}
        id="transaction-comment"
      />
      <Button
        onClick={handleSubmit(async ({ comment, amount, date, type }) => {
          const newTransaction = await upsert({
            comment,
            amount,
            date: date.toSeconds(),
            type,
          });
          update((transactions) =>
            transactions ? [...transactions, newTransaction] : transactions
          );
          history.push(makePath(transactionsPathName));
        })}
      >
        Save
      </Button>
    </>
  );
};

export default TransactionsForm;
