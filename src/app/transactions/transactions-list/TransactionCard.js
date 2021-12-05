import React from "react";
import { number, shape, string } from "prop-types";
import { Divider, ListItem, ListItemButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import isPropValid from "@emotion/is-prop-valid";
import { DateTime } from "luxon";
import { useReadData, useWriteData } from "hooks";

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
  const { remove } = useWriteData("transactions");
  const { update } = useReadData("transactions");

  const date = DateTime.fromSeconds(transaction.date);

  return (
    <>
      <Divider />
      <ListItem>
        <ListItemButton
          sx={{ padding: 0 }}
          onClick={async () => {
            await remove(transaction.id);
            update((transactions) =>
              transactions.filter(({ id }) => id !== transaction.id)
            );
          }}
        >
          <TransactionColumn width="15">
            <Typography color="textPrimary">
              {`${date.day}`.padStart(2, "0")}
            </Typography>
            <Typography color="textPrimary">{date.weekdayShort}</Typography>
          </TransactionColumn>
          <TransactionColumn autoWidth>
            <Typography color="textPrimary">{transaction.comment}</Typography>
            <Typography color="textPrimary">
              {transaction.account?.name || transaction.originAccount?.name} -{" "}
              {transaction.category?.name ||
                transaction.destinationAccount?.name}
            </Typography>
          </TransactionColumn>
          <TransactionColumn width="15">
            <Typography color="textPrimary">{transaction.amount}</Typography>
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
