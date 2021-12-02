import { AppBar, Button, TextField, Toolbar, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
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
import { DelayedCircularProgress } from "components";
import { useReadData } from "hooks";
import { MobileDatePicker } from "@mui/lab";
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

  const { loading: categoriesLoading, data: categories = [] } = useReadData(
    "categories"
  );

  const accountsHash = useMemo(
    () =>
      accounts.reduce(
        (hash, account) => ({ ...hash, [account.id]: account }),
        {}
      ),
    [accounts]
  );

  const categoriesHash = useMemo(
    () =>
      categories.reduce(
        (hash, category) => ({ ...hash, [category.id]: category }),
        {}
      ),
    [categories]
  );

  const transactionsWithRelationships = filteredTransactions.map(
    (transaction) => ({
      ...transaction,
      account: accountsHash[transaction.accountId],
      originAccount: accountsHash[transaction.originAccountId],
      destinationAccount: accountsHash[transaction.destinationAccountId],
      category: categoriesHash[transaction.categoryId],
    })
  );

  const { income, expense } = transactionsTotals(transactionsWithRelationships);

  const classes = useStyles();

  return (
    <>
      <AppBar position="sticky">
        <Toolbar classes={{ root: classes.spacedChildren }}>
          <MobileDatePicker
            openTo="year"
            views={["year", "month"]}
            value={selectedMonth}
            onChange={setSelectedMonth}
            renderInput={(props) => <TextField {...props} variant="standard" />}
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

      {loading || accountsLoading || categoriesLoading ? (
        <DelayedCircularProgress />
      ) : (
        transactionsWithRelationships
          .reduce((reversed, transaction) => [transaction, ...reversed], [])
          .map((transaction) => (
            <TransactionCard transaction={transaction} key={transaction.id} />
          ))
      )}
    </>
  );
};

export default TransactionsList;
