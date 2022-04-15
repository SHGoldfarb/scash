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
import { useData } from "hooks";
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

  const { loading, data: transactions = [] } = useData("transactions");

  const { loading: accountsLoading, data: accounts = [] } = useData("accounts");

  const { loading: objectivesLoading, data: objectives = [] } = useData(
    "objectives"
  );

  const { loading: incomeSourcesLoading, data: incomeSources = [] } = useData(
    "incomeSources"
  );

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

  const objectivesHash = useMemo(
    () =>
      objectives.reduce(
        (hash, objective) => ({ ...hash, [objective.id]: objective }),
        {}
      ),
    [objectives]
  );

  const incomeSourcesHash = useMemo(
    () =>
      incomeSources.reduce(
        (hash, incomeSource) => ({ ...hash, [incomeSource.id]: incomeSource }),
        {}
      ),
    [incomeSources]
  );

  const transactionsWithRelationships = filteredTransactions.map(
    (transaction) => ({
      ...transaction,
      account: accountsHash[transaction.accountId],
      originAccount: accountsHash[transaction.originAccountId],
      destinationAccount: accountsHash[transaction.destinationAccountId],
      objective: objectivesHash[transaction.objectiveId],
      incomeSource: incomeSourcesHash[transaction.incomeSourceId],
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
      objectivesLoading ||
      incomeSourcesLoading ? (
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
