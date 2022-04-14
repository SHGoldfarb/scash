import React from "react";
import { func } from "prop-types";
import { TextField } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useFormObjectives } from "./hooks";

const ObjectiveField = ({ register }) => {
  const { availableObjectives, loading } = useFormObjectives();

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const defaultObjectiveId = availableObjectives[0]?.id;

  const { name, ref, onBlur, onChange } = register("objectiveId");

  return (
    <TextField
      select
      SelectProps={{ native: true }}
      label="Objective"
      variant="filled"
      id="transaction-objective"
      fullWidth
      defaultValue={defaultObjectiveId}
      name={name}
      inputRef={ref}
      onBlur={onBlur}
      onChange={onChange}
    >
      {availableObjectives.map((objective) => (
        <option value={objective.id} key={objective.id}>
          {objective.name}
        </option>
      ))}
    </TextField>
  );
};

ObjectiveField.propTypes = {
  register: func.isRequired,
};

export default ObjectiveField;
