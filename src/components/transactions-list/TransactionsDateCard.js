import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { arrayOf, shape } from "prop-types";
import { DateTime } from "luxon";
import { TransactionInfo } from "./transactions-date-card";

const TransactionsDateCard = ({ sortedTransactions }) => {
  const date = DateTime.fromSeconds(sortedTransactions[0].date);

  return (
    <Card sx={{ margin: 1 }}>
      <CardHeader title={date.toFormat("ccc dd")} />
      <CardContent>
        {sortedTransactions.map((transaction) => (
          <TransactionInfo transaction={transaction} key={transaction.id} />
        ))}
      </CardContent>
    </Card>
  );
};

TransactionsDateCard.propTypes = {
  sortedTransactions: arrayOf(shape()).isRequired,
};

export default TransactionsDateCard;
