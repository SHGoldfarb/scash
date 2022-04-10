import React, { useMemo } from "react";
import { List } from "@mui/material";
import { useReadData } from "hooks";
import { DelayedCircularProgress } from "components";
import { Item, ObjectiveItem } from "./objectives";

const Objectives = () => {
  const { loading: categoriesLoading, data: categories = [] } = useReadData(
    "categories"
  );
  const { loading: transactionsLoading, data: transactions = [] } = useReadData(
    "transactions"
  );

  const amountsPerObjective = useMemo(() => {
    const amounts = { total: 0 };
    transactions.forEach((transaction) => {
      amounts[transaction.categoryId] = amounts[transaction.categoryId] || 0;
      if (transaction.type === "expense") {
        amounts[transaction.categoryId] -= transaction.amount;
      }
      if (transaction.type === "income") {
        amounts.total += transaction.amount;
      }
    });

    categories.forEach((category) => {
      amounts.total -= category.assignedAmount;
    });
    return amounts;
  }, [transactions, categories]);

  if (categoriesLoading || transactionsLoading) {
    return <DelayedCircularProgress />;
  }

  return (
    <List>
      <Item label="Without objective" amount={amountsPerObjective.total} />
      {categories.map((category) => {
        return (
          <ObjectiveItem
            key={category.id}
            categoryId={category.id}
            amount={
              (amountsPerObjective[category.id] || 0) + category.assignedAmount
            }
          />
        );
      })}
    </List>
  );
};

export default Objectives;
