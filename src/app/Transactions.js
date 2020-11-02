import { Button, IconButton, TextField } from "@material-ui/core";
import React from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { number, shape, string } from "prop-types";
import { Delete } from "@material-ui/icons";
import { useReadData, useWriteData } from "../hooks";
import { editPathName, makePath, transactionsPathName } from "../utils";

const TransactionCard = ({ transaction }) => {
  const { remove } = useWriteData("transactions");
  const { update } = useReadData("transactions");

  return (
    <div>
      {`${transaction.id} - ${transaction.comment} - $${transaction.amount}`}
      <IconButton
        onClick={async () => {
          await remove(transaction.id);
          update((transactions) =>
            transactions.filter(({ id }) => id !== transaction.id)
          );
        }}
      >
        <Delete color="error" />
      </IconButton>
    </div>
  );
};

TransactionCard.propTypes = {
  transaction: shape({
    id: number.isRequired,
    comment: string.isRequired,
    amount: number.isRequired,
  }).isRequired,
};

const TransactionsList = () => {
  const { loading, data: transactions } = useReadData("transactions");
  if (loading) return <div>Loading...</div>;

  return (
    <>
      {transactions
        .reduce((reversed, transaction) => [transaction, ...reversed], [])
        .map((transaction) => (
          <TransactionCard transaction={transaction} key={transaction.id} />
        ))}
    </>
  );
};

const TransactionsForm = () => {
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const { register, handleSubmit, errors } = useForm();
  const history = useHistory();

  return (
    <>
      <TextField
        variant="filled"
        label="Amount"
        name="amount"
        type="number"
        required
        error={!!errors.amount}
        helperText={errors.amount ? "Please enter number" : ""}
        inputRef={register({ pattern: /[0-9]*/, required: true })}
      />
      <TextField
        variant="filled"
        label="Comment"
        name="comment"
        inputRef={register}
      />
      <Button
        onClick={handleSubmit(async ({ comment, amount }) => {
          const newTransaction = await upsert({ comment, amount });
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

const Transactions = () => {
  return (
    <Switch>
      <Route path={makePath(transactionsPathName, editPathName)}>
        <TransactionsForm />
      </Route>
      <Route path={makePath(transactionsPathName)}>
        <Button
          component={Link}
          to={makePath(transactionsPathName, editPathName)}
        >
          New Transaction
        </Button>
        <TransactionsList />
      </Route>
    </Switch>
  );
};

export default Transactions;
