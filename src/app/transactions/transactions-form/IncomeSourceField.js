import React from "react";
import { func } from "prop-types";
import { TextField } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useFormIncomeSources } from "./hooks";

const IncomeSourceField = ({ register }) => {
  const { availableIncomeSources, loading } = useFormIncomeSources();

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const defaultIncomeSourceId = availableIncomeSources[0]?.id;

  const { name, ref, onBlur, onChange } = register("incomeSourceId");

  return (
    <TextField
      select
      SelectProps={{ native: true }}
      label="Income Source"
      variant="filled"
      id="transaction-income-source"
      fullWidth
      defaultValue={defaultIncomeSourceId}
      name={name}
      inputRef={ref}
      onBlur={onBlur}
      onChange={onChange}
    >
      {availableIncomeSources.map((incomeSource) => (
        <option value={incomeSource.id} key={incomeSource.id}>
          {incomeSource.name}
        </option>
      ))}
    </TextField>
  );
};

IncomeSourceField.propTypes = {
  register: func.isRequired,
};

export default IncomeSourceField;
