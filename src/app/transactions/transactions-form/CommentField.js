import React from "react";
import { TextField } from "@mui/material";
import { useTransactionFormContext } from "../contexts";

const name = "comment";

const CommentField = () => {
  const {
    values: { comment },
    setField,
  } = useTransactionFormContext();

  return (
    <TextField
      variant="filled"
      label="Comment"
      id="transaction-comment"
      fullWidth
      name={name}
      onChange={(e) => setField(name)(e.target.value)}
      value={comment || ""}
    />
  );
};

export default CommentField;
