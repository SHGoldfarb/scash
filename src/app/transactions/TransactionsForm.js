import { Button, TextField } from "@material-ui/core";
import React, { forwardRef } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { DateTimePicker } from "@material-ui/pickers";
import { useReadData, useWriteData } from "../../hooks";
import { makePath, parseSearchParams, transactionsPathName } from "../../utils";

const dateDisplayFormat = "yyyy-MM-dd HH:mm";

const useDefaultDate = () => {
  const location = useLocation();

  const { month, year } = parseSearchParams(location.search);

  const currentDate = DateTime.local();

  if (`${currentDate.month}` === month && `${currentDate.year}` === year) {
    // selected month is today's month
    return currentDate;
  }

  const selectedDate = DateTime.fromObject({ month, year });

  if (currentDate > selectedDate) {
    // selected month is a past month
    return selectedDate.endOf("month");
  }

  // selected month is a future month

  return selectedDate.startOf("month");
};

const TransactionsForm = () => {
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const { register, handleSubmit, errors, control } = useForm();
  const history = useHistory();

  const defaultDate = useDefaultDate();

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
        fullWidth
      >
        <option value="expense">Expense</option>
        <option value="income">Income</option>
        <option value="transfer">Transfer</option>
      </TextField>
      <Controller
        as={forwardRef((props, ref) => (
          <DateTimePicker {...props} inputRef={ref} />
        ))}
        control={control}
        inputVariant="filled"
        label="Date"
        name="date"
        format={dateDisplayFormat}
        defaultValue={defaultDate}
        id="transaction-date"
        ampm={false}
        fullWidth
      />
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
      <TextField
        variant="filled"
        label="Comment"
        name="comment"
        inputRef={register}
        id="transaction-comment"
        fullWidth
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
