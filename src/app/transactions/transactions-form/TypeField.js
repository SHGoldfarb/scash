import React from "react";
import { TextField } from "@mui/material";
import { func } from "prop-types";

const TypeField = ({ register }) => {
  const { name, onChange, onBlur, ref } = register("type");
  return (
    <TextField
      select
      SelectProps={{ native: true }}
      label="Type"
      variant="filled"
      name={name}
      id={`transaction-${name}`}
      fullWidth
      onChange={onChange}
      onBlur={onBlur}
      inputRef={ref}
    >
      <option value="expense">Expense</option>
      <option value="income">Income</option>
      <option value="transfer">Transfer</option>
    </TextField>
  );
};

TypeField.propTypes = {
  register: func.isRequired,
};

export default TypeField;
