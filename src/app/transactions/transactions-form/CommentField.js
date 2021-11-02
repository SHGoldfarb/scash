import React from "react";
import { TextField } from "@material-ui/core";

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
