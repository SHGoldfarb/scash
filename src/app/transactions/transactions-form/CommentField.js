import React from "react";
import { TextField } from "@mui/material";

const CommentField = (props) => {
  return (
    <TextField
      variant="filled"
      label="Comment"
      name="comment"
      id="transaction-comment"
      fullWidth
      {...props}
    />
  );
};

export default CommentField;
