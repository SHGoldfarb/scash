import React from "react";
import { number, shape, string } from "prop-types";
import { IconButton, Typography } from "@material-ui/core";
import { Delete } from "@material-ui/icons";
import { DateTime } from "luxon";
import { useReadData, useWriteData } from "hooks";

const TransactionCard = ({ transaction }) => {
  const { remove } = useWriteData("transactions");
  const { update } = useReadData("transactions");

  return (
    <div>
      <Typography color="textPrimary">
        {`${transaction.id} - ${transaction.comment} - $${
          transaction.amount
        } - ${DateTime.fromSeconds(transaction.date).toLocaleString(
          DateTime.DATETIME_MED
        )} - ${transaction.type}`}
      </Typography>

      <IconButton
        onClick={async () => {
          await remove(transaction.id);
          update((transactions) =>
            transactions.filter(({ id }) => id !== transaction.id)
          );
        }}
      >
        <Delete color="error" />
      </IconButton>
    </div>
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
