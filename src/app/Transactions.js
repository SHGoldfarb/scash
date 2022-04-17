import React from "react";
import { Route, Switch } from "react-router-dom";
import { editPathName, makePath, transactionsPathName } from "utils";
import { TransactionsForm, MonthTransactionsList } from "./transactions";

const Transactions = () => {
  return (
    <Switch>
      <Route path={makePath(transactionsPathName, editPathName)}>
        <TransactionsForm />
      </Route>
      <Route path={makePath(transactionsPathName)}>
        <MonthTransactionsList />
      </Route>
    </Switch>
  );
};

export default Transactions;
