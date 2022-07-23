import React from "react";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useData } from "hooks";
import { useCurrentTransaction } from "../hooks";

const DeleteButton = () => {
  const { remove } = useData("transactions");
  const { transaction, loading } = useCurrentTransaction();
  const history = useHistory();

  const transactionId = transaction?.id;

  if (loading || !transactionId) {
    return null;
  }

  return (
    <Button
      onClick={async () => {
        await remove(transactionId);
        history.goBack();
      }}
      color="error"
    >
      Delete
    </Button>
  );
};

export default DeleteButton;
