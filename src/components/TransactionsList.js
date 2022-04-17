import React from "react";
import { List } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useData } from "hooks";
import { arrayOf, shape } from "prop-types";
import { TransactionCard } from "./transactions-list";

const TransactionsList = ({ transactions }) => {
  const { loading: accountsLoading, dataHash: accountsHash = {} } = useData(
    "accounts"
  );

  const { loading: objectivesLoading, dataHash: objectivesHash = {} } = useData(
    "objectives"
  );

  const {
    loading: incomeSourcesLoading,
    dataHash: incomeSourcesHash = {},
  } = useData("incomeSources");

  const transactionsWithRelationships = transactions.map((transaction) => ({
    ...transaction,
    account: accountsHash[transaction.accountId],
    originAccount: accountsHash[transaction.originAccountId],
    destinationAccount: accountsHash[transaction.destinationAccountId],
    objective: objectivesHash[transaction.objectiveId],
    incomeSource: incomeSourcesHash[transaction.incomeSourceId],
  }));

  if (accountsLoading || objectivesLoading || incomeSourcesLoading) {
    return <DelayedCircularProgress />;
  }

  return (
    <List>
      {transactionsWithRelationships
        .reduce((reversed, transaction) => [transaction, ...reversed], [])
        .map((transaction) => (
          <TransactionCard transaction={transaction} key={transaction.id} />
        ))}
    </List>
  );
};

TransactionsList.propTypes = {
  transactions: arrayOf(shape()).isRequired,
};

export default TransactionsList;
