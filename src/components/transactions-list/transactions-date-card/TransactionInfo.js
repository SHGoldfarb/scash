import React from "react";
import { number, shape, string } from "prop-types";
import { Divider, ListItem, ListItemButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import isPropValid from "@emotion/is-prop-valid";
import {
  currencyFormat,
  editPathName,
  makePath,
  transactionsPathName,
} from "utils";
import { Link } from "react-router-dom";
import { useData } from "hooks";
import { DelayedCircularProgress } from "components";

const TransactionColumn = styled("div", {
  shouldForwardProp: (prop) => isPropValid(prop),
})(({ theme, autoWidth }) => ({
  padding: theme.spacing(),
  width: "auto",
  flexGrow: 0,
  flexShrink: autoWidth ? 1 : 0,
  margin: autoWidth ? "0 auto 0 0 " : "none",
}));

const TransactionInfo = ({ transaction }) => {
  const { loading: accountsLoading, dataHash: accountsHash = {} } = useData(
    "accounts"
  );

  const { loading: objectivesLoading, dataHash: objectivesHash = {} } = useData(
    "objectives"
  );

  const {
    loading: incomeSourcesLoading,
    dataHash: incomeSourcesHash = {},
  } = useData("incomeSources");

  const loading = accountsLoading || objectivesLoading || incomeSourcesLoading;

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const account = accountsHash[transaction.accountId];
  const originAccount = accountsHash[transaction.originAccountId];
  const destinationAccount = accountsHash[transaction.destinationAccountId];
  const objective = objectivesHash[transaction.objectiveId];
  const incomeSource = incomeSourcesHash[transaction.incomeSourceId];

  return (
    <>
      <Divider />
      <ListItem>
        <ListItemButton
          component={Link}
          sx={{ padding: 0 }}
          to={makePath(transactionsPathName, editPathName, {
            params: {
              id: transaction.id,
            },
          })}
        >
          <TransactionColumn autoWidth>
            <Typography color="textPrimary">{transaction.comment}</Typography>
            <Typography color="textSecondary" variant="caption">
              {account?.name || originAccount?.name}
              {transaction.type === "income" ? " < " : " > "}
            </Typography>
            <Typography
              color={
                (transaction.type === "expense" && "error.light") ||
                (transaction.type === "income" && "success.light") ||
                "textSecondary"
              }
              variant="caption"
            >
              {objective?.name ||
                incomeSource?.name ||
                destinationAccount?.name}
            </Typography>
          </TransactionColumn>
          <TransactionColumn>
            <Typography
              color={
                (transaction.type === "expense" && "error.light") ||
                (transaction.type === "income" && "success.light") ||
                "textPrimary"
              }
            >
              {currencyFormat(transaction.amount)}
            </Typography>
          </TransactionColumn>
        </ListItemButton>
      </ListItem>
    </>
  );
};

TransactionInfo.propTypes = {
  transaction: shape({
    id: number.isRequired,
    comment: string.isRequired,
    amount: number.isRequired,
  }).isRequired,
};

export default TransactionInfo;
