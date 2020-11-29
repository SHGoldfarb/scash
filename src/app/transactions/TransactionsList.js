import { Button, CircularProgress } from "@material-ui/core";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  editPathName,
  makeIsTransactionInMonthYear,
  makePath,
  transactionsPathName,
} from "utils";
import { useReadData } from "../../hooks";
import { TransactionCard } from "./transactions-list";

const TransactionsList = () => {
  const [selectedMonth] = useState(() => ({
    year: DateTime.local().year,
    month: DateTime.local().month,
  }));

  const bySelectedMonthYear = makeIsTransactionInMonthYear(selectedMonth);

  const { loading, data: transactions } = useReadData("transactions");

  return (
    <>
      <Button
        component={Link}
        to={makePath(transactionsPathName, editPathName)}
      >
        New Transaction
      </Button>
      {loading ? (
        <CircularProgress />
      ) : (
        transactions
          .filter(bySelectedMonthYear)
          .reduce((reversed, transaction) => [transaction, ...reversed], [])
          .map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))
      )}
    </>
  );
};

export default TransactionsList;
