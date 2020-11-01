import { Button } from "@material-ui/core";
import React from "react";
import { Link, Route, Switch } from "react-router-dom";
import { useReadData } from "../hooks";
import { editPathName, makePath, transactionsPathName } from "../utils";

const TransactionsList = () => {
  const { loading, data: transactions } = useReadData("transactions");
  if (loading) return <div>Cargando...</div>;

  return <pre>{JSON.stringify(transactions, null, 2)}</pre>;
};

const TransactionsForm = () => {
  return <div>fomr</div>;
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
