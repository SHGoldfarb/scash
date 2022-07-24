import React from "react";
import { Button } from "@mui/material";
import { useTransactionFormContext } from "../contexts";

const SaveButton = () => {
  const { handleSubmit, isValid } = useTransactionFormContext();

  return (
    <Button
      sx={{ margin: 1 }}
      variant="contained"
      disabled={!isValid}
      onClick={handleSubmit}
    >
      Save
    </Button>
  );
};

export default SaveButton;
