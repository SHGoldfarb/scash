import {
  AppBar,
  Button,
  CircularProgress,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  editPathName,
  makeIsTransactionInMonthYear,
  makePath,
  moneyFormat,
  transactionsPathName,
  transactionsTotals,
} from "utils";
import { DatePicker } from "@material-ui/pickers";
import { useReadData } from "../../hooks";
import { TransactionCard } from "./transactions-list";

const useStyles = makeStyles((theme) => ({
  spacedChildren: {
    "& > *": {
      "&:not(:last-child)": {
        marginRight: "auto",
      },
    },
  },
  income: {
    color: theme.palette.success.light,
  },
  expense: {
    color: theme.palette.error.light,
  },
  totalsDisplay: {
    display: "flex",
    padding: theme.spacing(2),
    "& > *": {
      margin: "auto",
    },
  },
  createButton: {
    minWidth: "10rem",
  },
}));

const TransactionsList = () => {
  const [selectedMonth, setSelectedMonth] = useState(() => DateTime.local());

  const { loading, data: transactions = [] } = useReadData("transactions");

  const classes = useStyles();

  const filteredTransactions = transactions.filter(
    makeIsTransactionInMonthYear({
      month: selectedMonth.month,
      year: selectedMonth.year,
    })
  );

  const { income, expense } = transactionsTotals(filteredTransactions);

  return (
    <>
      <AppBar position="sticky">
        <Toolbar classes={{ root: classes.spacedChildren }}>
          <DatePicker
            variant="inline"
            openTo="year"
            views={["year", "month"]}
            value={selectedMonth}
            onChange={setSelectedMonth}
          />

          <Button
            component={Link}
            to={makePath(transactionsPathName, editPathName)}
            className={classes.createButton}
          >
            New Transaction
          </Button>
        </Toolbar>
      </AppBar>
      <div className={clsx(classes.totalsDisplay)}>
        <Typography variant="body1" classes={{ root: classes.income }}>
          {moneyFormat(income)}
        </Typography>
        <Typography variant="body1" classes={{ root: classes.expense }}>
          {moneyFormat(expense)}
        </Typography>
      </div>

      {loading ? (
        <CircularProgress />
      ) : (
        filteredTransactions
          .reduce((reversed, transaction) => [transaction, ...reversed], [])
          .map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))
      )}
    </>
  );
};

export default TransactionsList;
