import React from "react";
import { number } from "prop-types";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useData } from "hooks";

const DeleteButton = ({ transactionId }) => {
  const { remove } = useData("transactions");

  const history = useHistory();

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

DeleteButton.propTypes = {
  transactionId: number.isRequired,
};

export default DeleteButton;
