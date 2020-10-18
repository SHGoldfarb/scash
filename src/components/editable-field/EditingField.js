import React, { useState } from "react";
import { func, string } from "prop-types";
import { Done } from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";

const EditingField = ({ value, onConfirm }) => {
  const [inputValue, setInputValue] = useState(null);

  const shownValue = inputValue === null ? value : inputValue;

  return (
    <div>
      <TextField
        id="value-textfield"
        value={shownValue}
        onChange={(ev) => setInputValue(ev.target.value)}
      />
      <IconButton
        aria-label="save"
        onClick={() => {
          onConfirm(shownValue);
          setInputValue(null);
        }}
      >
        <Done color="primary" />
      </IconButton>
    </div>
  );
};

EditingField.propTypes = {
  value: string.isRequired,
  onConfirm: func.isRequired,
};

export default EditingField;
