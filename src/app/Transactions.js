import React from "react";
import { Button } from "@material-ui/core";
import { Link, Route, Switch } from "react-router-dom";
import { editPathName, makePath, transactionsPathName } from "../utils";
import { TransactionsForm, TransactionsList } from "./transactions";

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
