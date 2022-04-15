import React from "react";
import { number } from "prop-types";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { DateTime } from "luxon";
import { makePath, transactionsPathName } from "utils";
import { useData } from "hooks";

const DeleteButton = ({ transactionId, transactionDate }) => {
  const { remove } = useData("transactions");

  const history = useHistory();

  const date = DateTime.fromSeconds(parseInt(transactionDate, 10));

  return (
    <Button
      onClick={async () => {
        await remove(transactionId);
        history.push(
          makePath(transactionsPathName, {
            params: {
              month: date.month,
              year: date.year,
            },
          })
        );
      }}
      color="error"
    >
      Delete
    </Button>
  );
};

DeleteButton.propTypes = {
  transactionId: number.isRequired,
  transactionDate: number.isRequired,
};

export default DeleteButton;
