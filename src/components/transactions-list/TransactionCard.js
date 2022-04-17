import React from "react";
import { number, shape, string } from "prop-types";
import { Divider, ListItem, ListItemButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import isPropValid from "@emotion/is-prop-valid";
import { DateTime } from "luxon";
import {
  currencyFormat,
  editPathName,
  makePath,
  transactionsPathName,
} from "utils";
import { Link } from "react-router-dom";

const TransactionColumn = styled("div", {
  shouldForwardProp: (prop) => isPropValid(prop),
})(({ theme, width, autoWidth }) => ({
  padding: theme.spacing(),
  width: width ? `${width}%` : "auto",
  flexGrow: 0,
  flexShrink: autoWidth ? 1 : 0,
  margin: autoWidth ? "0 auto 0 0 " : "none",
}));

const TransactionCard = ({ transaction }) => {
  const date = DateTime.fromSeconds(transaction.date);

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
          <TransactionColumn width="10" sx={{ textAlign: "center" }}>
            <Typography color="textPrimary">
              {`${date.day}`.padStart(2, "0")}
            </Typography>
            <Typography color="textPrimary">{date.weekdayShort}</Typography>
          </TransactionColumn>
          <TransactionColumn autoWidth>
            <Typography color="textPrimary">{transaction.comment}</Typography>
            <Typography color="textSecondary" variant="caption">
              {transaction.account?.name || transaction.originAccount?.name}
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
              {transaction.objective?.name ||
                transaction.incomeSource?.name ||
                transaction.destinationAccount?.name}
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

TransactionCard.propTypes = {
  transaction: shape({
    id: number.isRequired,
    comment: string.isRequired,
    amount: number.isRequired,
  }).isRequired,
};

export default TransactionCard;
