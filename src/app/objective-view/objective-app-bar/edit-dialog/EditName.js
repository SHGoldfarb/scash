import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { func } from "prop-types";
import { useCurrentObjective } from "../../hooks";

const EditName = ({ onEdit }) => {
  const [currentName, setCurrentName] = useState(null);
  const { objective, loading, update } = useCurrentObjective();

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const value = currentName || objective.name;

  return (
    <>
      <TextField
        value={value}
        label="name"
        inputProps={{ autoFocus: true }}
        onChange={(ev) => setCurrentName(ev.target.value)}
      />
      <Button
        onClick={async () => {
          await update({ name: value });
          onEdit();
        }}
        color="success"
      >
        Save Name
      </Button>
    </>
  );
};

EditName.propTypes = {
  onEdit: func.isRequired,
};

export default EditName;
