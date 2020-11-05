import React from "react";
import { useReadData } from "../../hooks";
import { TransactionCard } from "./transactions-list";

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

export default TransactionsList;
