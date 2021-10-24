import { Button, TextField } from "@material-ui/core";
import React, { forwardRef } from "react";
import { useHistory } from "react-router-dom";
import { Controller, useForm } from "react-hook-form";
import { DateTimePicker } from "@material-ui/pickers";
import { useReadData, useWriteData } from "../../hooks";
import { isActive, makePath, transactionsPathName } from "../../utils";
import { useDefaultDate } from "./utils";

const dateDisplayFormat = "yyyy-MM-dd HH:mm";

const TransactionsForm = () => {
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const { register, handleSubmit, errors, control, watch } = useForm();
  const history = useHistory();

  const defaultDate = useDefaultDate();

  const { data: accounts = [], loading: accountsLoading } = useReadData(
    "accounts"
  );

  const activeAccounts = accounts.filter(isActive);

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
      {!accountsLoading && watch("type") !== "transfer" ? (
        <TextField
          select
          SelectProps={{ native: true }}
          label="Account"
          variant="filled"
          name="accountId"
          inputRef={register}
          id="transaction-account"
          fullWidth
          defaultValue={activeAccounts[0]?.id}
        >
          {activeAccounts.map((account) => (
            <option value={account.id} key={account.id}>
              {account.name}
            </option>
          ))}
        </TextField>
      ) : null}
      {!accountsLoading && watch("type") === "transfer" ? (
        <>
          <TextField
            select
            SelectProps={{ native: true }}
            label="Origin Account"
            variant="filled"
            name="originAccountId"
            inputRef={register}
            id="transaction-account"
            fullWidth
            defaultValue={activeAccounts[0]?.id}
          >
            {activeAccounts.map((account) => (
              <option value={account.id} key={account.id}>
                {account.name}
              </option>
            ))}
          </TextField>
          <TextField
            select
            SelectProps={{ native: true }}
            label="Destination Account"
            variant="filled"
            name="destinationAccountId"
            inputRef={register}
            id="transaction-account"
            fullWidth
            defaultValue={activeAccounts[0]?.id}
          >
            {activeAccounts.map((account) => (
              <option value={account.id} key={account.id}>
                {account.name}
              </option>
            ))}
          </TextField>
        </>
      ) : null}
      <TextField
        variant="filled"
        label="Comment"
        name="comment"
        inputRef={register}
        id="transaction-comment"
        fullWidth
      />
      <Button
        disabled={!watch("accountId")}
        onClick={handleSubmit(
          async ({
            comment,
            amount,
            date,
            type,
            accountId,
            originAccountId,
            destinationAccountId,
          }) => {
            const newTransaction = await upsert({
              comment,
              amount,
              date: date.toSeconds(),
              type,
              accountId: accountId ? parseInt(accountId, 10) : null,
              originAccountId: originAccountId
                ? parseInt(originAccountId, 10)
                : null,
              destinationAccountId: destinationAccountId
                ? parseInt(destinationAccountId, 10)
                : null,
            });

            update((transactions) =>
              transactions ? [...transactions, newTransaction] : transactions
            );

            history.push(makePath(transactionsPathName));
          }
        )}
      >
        Save
      </Button>
    </>
  );
};

export default TransactionsForm;
