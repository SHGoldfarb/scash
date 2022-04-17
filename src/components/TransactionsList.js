import React, { useMemo } from "react";
import { List } from "@mui/material";
import { arrayOf, shape } from "prop-types";
import { DateTime } from "luxon";
import { by } from "utils";
import { reversed } from "lib";
import { TransactionsDateCard } from "./transactions-list";

const TransactionsList = ({ transactions }) => {
  const transactionsByDate = useMemo(() => {
    const dates = {};
    transactions.sort(by("date")).forEach((transaction) => {
      const date = DateTime.fromSeconds(transaction.date).toFormat(
        "yyyy-MM-dd"
      );
      if (!dates[date]) {
        dates[date] = [];
      }

      dates[date].push(transaction);
    });

    return dates;
  }, [transactions]);

  return (
    <List>
      {reversed(Object.keys(transactionsByDate).sort()).map((date) => (
        <TransactionsDateCard
          sortedTransactions={transactionsByDate[date]}
          key={date}
        />
      ))}
    </List>
  );
};

TransactionsList.propTypes = {
  transactions: arrayOf(shape()).isRequired,
};

export default TransactionsList;
