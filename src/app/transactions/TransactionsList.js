import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
} from "@material-ui/core";
import { DateTime } from "luxon";
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import clsx from "clsx";
import {
  by,
  editPathName,
  makeIsTransactionInMonthYear,
  makePath,
  currencyFormat,
  transactionsPathName,
  transactionsTotals,
} from "utils";
import { DatePicker } from "@material-ui/pickers";
import { DelayedCircularProgress } from "components";
import { useReadData } from "hooks";
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

  const { loading: accountsLoading, data: accounts = [] } = useReadData(
    "accounts"
  );

  const accountsHash = useMemo(
    () =>
      accounts.reduce(
        (hash, account) => ({ ...hash, [account.id]: account }),
        {}
      ),
    [accounts]
  );

  const transactionsWithAccounts = filteredTransactions.map((transaction) => ({
    ...transaction,
    account: accountsHash[transaction.accountId],
    originAccount: accountsHash[transaction.originAccountId],
    destinationAccount: accountsHash[transaction.destinationAccountId],
  }));

  const { income, expense } = transactionsTotals(transactionsWithAccounts);

  const classes = useStyles();

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
            to={makePath(transactionsPathName, editPathName, {
              params: {
                month: selectedMonth.month,
                year: selectedMonth.year,
              },
            })}
            className={classes.createButton}
          >
            New Transaction
          </Button>
        </Toolbar>
      </AppBar>
      <div className={clsx(classes.totalsDisplay)}>
        <Typography variant="body1" classes={{ root: classes.income }}>
          {currencyFormat(income)}
        </Typography>
        <Typography variant="body1" classes={{ root: classes.expense }}>
          {currencyFormat(expense)}
        </Typography>
      </div>

      {loading || accountsLoading ? (
        <DelayedCircularProgress />
      ) : (
        transactionsWithAccounts
          .reduce((reversed, transaction) => [transaction, ...reversed], [])
          .map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))
      )}
    </>
  );
};

export default TransactionsList;
