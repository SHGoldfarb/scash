import { DateTime } from "luxon";

export const makeIsTransactionInMonthYear = ({ year, month }) => {
  const firstSecond = DateTime.fromObject({ year, month })
    .startOf("month")
    .startOf("day")
    .toSeconds();

  const lastSecond = DateTime.fromObject({ year, month })
    .endOf("month")
    .endOf("day")
    .toSeconds();

  return (transaction) =>
    transaction.date >= firstSecond && transaction.date <= lastSecond;
};

export const transactionsTotals = (transactions) =>
  transactions.reduce(
    (totals, transaction) => ({
      income:
        totals.income +
        (transaction.type === "income" ? transaction.amount : 0),
      expense:
        totals.expense +
        (transaction.type === "expense" ? transaction.amount : 0),
    }),
    { income: 0, expense: 0 }
  );
