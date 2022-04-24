import React from "react";
import { List } from "@mui/material";
import { arrayOf, func, string } from "prop-types";
import { TransactionsDateCard } from "./transactions-date-cards";

const TransactionsDateCards = ({ dates, getSortedTransactions }) => {
  return (
    <List>
      {dates.map((date) => (
        <TransactionsDateCard
          sortedTransactions={getSortedTransactions(date)}
          key={date}
        />
      ))}
    </List>
  );
};

TransactionsDateCards.propTypes = {
  dates: arrayOf(string).isRequired,
  getSortedTransactions: func.isRequired,
};

export default TransactionsDateCards;
