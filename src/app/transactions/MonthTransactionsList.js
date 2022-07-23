import React, { useMemo } from "react";
import clsx from "clsx";
import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  by,
  makeIsTransactionInMonthYear,
  currencyFormat,
  transactionsTotals,
} from "src/utils";
import { DelayedCircularProgress, TransactionsList } from "src/components";
import { useData } from "src/hooks";
import { TransactionsAppBar } from "./month-transactions-list";
import { useSelectedMonth } from "./hooks";

const PREFIX = "TransactionsList";

const classes = {
  income: `${PREFIX}-income`,
  expense: `${PREFIX}-expense`,
  totalsDisplay: `${PREFIX}-totalsDisplay`,
};

const Root = styled("div")(({ theme }) => ({
  [`& .${classes.income}`]: {
    color: theme.palette.success.light,
  },

  [`& .${classes.expense}`]: {
    color: theme.palette.error.light,
  },

  [`& .${classes.totalsDisplay}`]: {
    display: "flex",
    padding: theme.spacing(1),
    paddingTop: theme.spacing(2),
    paddingBottom: 0,
    "& > *": {
      margin: "auto",
    },
  },
}));

const MonthTransactionsList = () => {
  const [selectedMonth] = useSelectedMonth();

  const { loading, data: transactions = [] } = useData("transactions");

  const filteredTransactions = useMemo(
    () =>
      transactions
        .filter(
          makeIsTransactionInMonthYear({
            month: selectedMonth.month,
            year: selectedMonth.year,
          })
        )
        .sort(by("date")),
    [transactions, selectedMonth]
  );

  const { income, expense } = transactionsTotals(filteredTransactions);

  return (
    <Root>
      <TransactionsAppBar />
      <div className={clsx(classes.totalsDisplay)}>
        <Typography variant="body1" classes={{ root: classes.income }}>
          {currencyFormat(income)}
        </Typography>
        <Typography variant="body1" classes={{ root: classes.expense }}>
          {currencyFormat(expense)}
        </Typography>
      </div>
      {loading ? (
        <DelayedCircularProgress />
      ) : (
        <TransactionsList transactions={filteredTransactions} />
      )}
    </Root>
  );
};

export default MonthTransactionsList;
