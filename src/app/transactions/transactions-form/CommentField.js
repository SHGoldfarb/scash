import React from "react";
import { TextField } from "@mui/material";
import { isEnterKey } from "src/utils";
import { useTransactionFormContext } from "../contexts";

const name = "comment";

const CommentField = () => {
  const {
    values: { comment },
    setField,
    handleSubmit,
  } = useTransactionFormContext();

  return (
    <TextField
      variant="filled"
      label="Comment"
      id="transaction-comment"
      fullWidth
      name={name}
      onChange={(e) => setField(name)(e.target.value)}
      onKeyPress={(e) => {
        if (isEnterKey(e)) {
          handleSubmit();
        }
      }}
      value={comment || ""}
    />
  );
};

export default CommentField;
