import React, { useMemo } from "react";
import clsx from "clsx";
import { List, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import {
  by,
  makeIsTransactionInMonthYear,
  currencyFormat,
  transactionsTotals,
} from "utils";
import { DelayedCircularProgress } from "components";
import { useReadData } from "hooks";
import { TransactionCard, TransactionsAppBar } from "./transactions-list";
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
    padding: theme.spacing(2),
    "& > *": {
      margin: "auto",
    },
  },
}));

const TransactionsList = () => {
  const [selectedMonth] = useSelectedMonth();

  const { loading, data: transactions = [] } = useReadData("transactions");

  const { loading: accountsLoading, data: accounts = [] } = useReadData(
    "accounts"
  );

  const { loading: categoriesLoading, data: categories = [] } = useReadData(
    "categories"
  );

  const {
    loading: incomeCategoriesLoading,
    data: incomeCategories = [],
  } = useReadData("incomeCategories");

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

  const incomeCategoriesHash = useMemo(
    () =>
      incomeCategories.reduce(
        (hash, category) => ({ ...hash, [category.id]: category }),
        {}
      ),
    [incomeCategories]
  );

  const transactionsWithRelationships = filteredTransactions.map(
    (transaction) => ({
      ...transaction,
      account: accountsHash[transaction.accountId],
      originAccount: accountsHash[transaction.originAccountId],
      destinationAccount: accountsHash[transaction.destinationAccountId],
      category:
        transaction.type === "expense"
          ? categoriesHash[transaction.categoryId]
          : incomeCategoriesHash[transaction.categoryId],
    })
  );

  const { income, expense } = transactionsTotals(transactionsWithRelationships);

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
      {loading ||
      accountsLoading ||
      categoriesLoading ||
      incomeCategoriesLoading ? (
        <DelayedCircularProgress />
      ) : (
        <List>
          {transactionsWithRelationships
            .reduce((reversed, transaction) => [transaction, ...reversed], [])
            .map((transaction) => (
              <TransactionCard transaction={transaction} key={transaction.id} />
            ))}
        </List>
      )}
    </Root>
  );
};

export default TransactionsList;
