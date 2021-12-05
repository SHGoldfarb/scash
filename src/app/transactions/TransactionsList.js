import {
  AppBar,
  Button,
  List,
  TextField,
  Toolbar,
  Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import clsx from "clsx";
import {
  by,
  editPathName,
  makeIsTransactionInMonthYear,
  makePath,
  currencyFormat,
  transactionsPathName,
  transactionsTotals,
  parseSearchParams,
} from "utils";
import { DelayedCircularProgress } from "components";
import { useReadData } from "hooks";
import { MobileDatePicker } from "@mui/lab";
import { TransactionCard } from "./transactions-list";

const PREFIX = "TransactionsList";

const classes = {
  spacedChildren: `${PREFIX}-spacedChildren`,
  income: `${PREFIX}-income`,
  expense: `${PREFIX}-expense`,
  totalsDisplay: `${PREFIX}-totalsDisplay`,
  createButton: `${PREFIX}-createButton`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.spacedChildren}`]: {
    "& > *": {
      "&:not(:last-child)": {
        marginRight: "auto",
      },
    },
  },

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

  [`& .${classes.createButton}`]: {
    minWidth: "10rem",
  },
}));

export const dateFormat = "MMMM yyyy";

// TODO: make this component more atomic
const TransactionsList = () => {
  const location = useLocation();
  const history = useHistory();
  const { month, year } = parseSearchParams(location.search);

  const selectedMonth =
    month && year ? DateTime.fromObject({ month, year }) : DateTime.local();

  const setSelectedMonth = (date) =>
    history.push(
      makePath(transactionsPathName, {
        params: {
          month: date.month,
          year: date.year,
        },
      })
    );

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
      <AppBar position="sticky">
        <Toolbar classes={{ root: classes.spacedChildren }}>
          <MobileDatePicker
            openTo="year"
            // TODO: fix this throwing console warning then opening month view
            // views={["year", "month"]}
            // TODO: remove the inputFormat prop once the `views` issue is resolved
            inputFormat={dateFormat}
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
