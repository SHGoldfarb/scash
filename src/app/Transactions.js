import { Button, TextField } from "@material-ui/core";
import React from "react";
import { Link, Route, Switch, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useReadData, useWriteData } from "../hooks";
import { editPathName, makePath, transactionsPathName } from "../utils";

const TransactionsList = () => {
  const { loading, data: transactions } = useReadData("transactions");
  if (loading) return <div>Cargando...</div>;

  return <pre>{JSON.stringify(transactions, null, 2)}</pre>;
};

const TransactionsForm = () => {
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const { register, handleSubmit } = useForm();
  const history = useHistory();
  return (
    <>
      <TextField
        variant="filled"
        label="Comment"
        name="comment"
        inputRef={register}
      />
      <Button
        onClick={handleSubmit(async ({ comment }) => {
          const newTransaction = await upsert({ comment });
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
        <TransactionsList />
        <Button
          component={Link}
          to={makePath(transactionsPathName, editPathName)}
        >
          New Transaction
        </Button>
      </Route>
    </Switch>
  );
};

export default Transactions;
