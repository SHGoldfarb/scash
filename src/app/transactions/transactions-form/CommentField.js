import React from "react";
import { TextField } from "@mui/material";
import { func } from "prop-types";

const CommentField = ({ register }) => {
  const { name, ref, onChange, onBlur } = register("comment");
  return (
    <TextField
      variant="filled"
      label="Comment"
      id="transaction-comment"
      fullWidth
      name={name}
      inputRef={ref}
      onChange={onChange}
      onBlur={onBlur}
    />
  );
};

CommentField.propTypes = {
  register: func.isRequired,
};

export default CommentField;
