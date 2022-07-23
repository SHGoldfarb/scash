import React from "react";
import { TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

const CommentField = () => {
  const { register } = useFormContext();

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

export default CommentField;
