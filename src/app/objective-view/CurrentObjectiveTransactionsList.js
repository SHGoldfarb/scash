import React, { useMemo } from "react";
import { Typography } from "@mui/material";
import { DelayedCircularProgress, TransactionsList } from "src/components";
import { useData } from "src/hooks";
import { useCurrentObjective } from "./hooks";

const CurrentObjectiveTransactionsList = () => {
  const { objective, loading: objectiveLoading } = useCurrentObjective();
  const { loading: transactionsLoading, data: transactions = [] } = useData(
    "transactions"
  );

  const id = objective?.id;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => t.objectiveId === id);
  }, [transactions, id]);

  if (objectiveLoading || transactionsLoading)
    return <DelayedCircularProgress />;

  if (!objective) return <Typography>Error</Typography>;

  return <TransactionsList transactions={filteredTransactions} paginated />;
};

export default CurrentObjectiveTransactionsList;
