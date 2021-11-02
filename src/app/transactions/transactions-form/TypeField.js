import React from "react";
import { TextField } from "@material-ui/core";

const TypeField = (props) => (
  <TextField
    select
    SelectProps={{ native: true }}
    label="Type"
    variant="filled"
    name="type"
    id="transaction-type"
    fullWidth
    {...props}
  >
    <option value="expense">Expense</option>
    <option value="income">Income</option>
    <option value="transfer">Transfer</option>
  </TextField>
);

export default TypeField;
