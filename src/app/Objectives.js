import React, { useMemo } from "react";
import { List } from "@mui/material";
import { useReadData } from "hooks";
import { DelayedCircularProgress } from "components";
import { Item, NewObjectiveButton, ObjectiveItem } from "./objectives";

const Objectives = () => {
  const { loading: objectivesLoading, data: objectives = [] } = useReadData(
    "objectives"
  );
  const { loading: transactionsLoading, data: transactions = [] } = useReadData(
    "transactions"
  );

  const amountsPerObjective = useMemo(() => {
    const amounts = { total: 0 };
    transactions.forEach((transaction) => {
      amounts[transaction.objectiveId] = amounts[transaction.objectiveId] || 0;
      if (transaction.type === "expense") {
        amounts[transaction.objectiveId] -= transaction.amount;
      }
      if (transaction.type === "income") {
        amounts.total += transaction.amount;
      }
    });

    objectives.forEach((objective) => {
      amounts.total -= objective.assignedAmount;
    });
    return amounts;
  }, [transactions, objectives]);

  if (objectivesLoading || transactionsLoading) {
    return <DelayedCircularProgress />;
  }

  return (
    <List>
      <Item label="Without objective" amount={amountsPerObjective.total} />
      {objectives.map((objective) => {
        return (
          <ObjectiveItem
            key={objective.id}
            objectiveId={objective.id}
            amount={
              (amountsPerObjective[objective.id] || 0) +
              objective.assignedAmount
            }
          />
        );
      })}
      <NewObjectiveButton />
    </List>
  );
};

export default Objectives;
