import React from "react";
import { number, shape, string } from "prop-types";
import { Divider, IconButton, ListItem, Typography } from "@mui/material";
import { Delete } from "@mui/icons-material";
import { DateTime } from "luxon";
import { useReadData, useWriteData } from "hooks";

const TransactionCard = ({ transaction }) => {
  const { remove } = useWriteData("transactions");
  const { update } = useReadData("transactions");

  return (
    <>
      <Divider />
      <ListItem>
        <Typography color="textPrimary">
          {`${transaction.id} - ${transaction.comment} - $${
            transaction.amount
          } - ${DateTime.fromSeconds(transaction.date).toLocaleString(
            DateTime.DATETIME_MED
          )} - ${transaction.type} - ${transaction.account?.name} - ${
            transaction.originAccount?.name
          } - ${transaction.destinationAccount?.name} - ${
            transaction.category?.name
          }`}
        </Typography>

        <IconButton
          onClick={async () => {
            await remove(transaction.id);
            update((transactions) =>
              transactions.filter(({ id }) => id !== transaction.id)
            );
          }}
          size="large"
        >
          <Delete color="error" />
        </IconButton>
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
