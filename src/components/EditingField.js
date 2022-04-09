import React, { useState } from "react";
import { bool, func, string } from "prop-types";
import { Done } from "@mui/icons-material";
import { IconButton, ListItemSecondaryAction, TextField } from "@mui/material";

const EditingField = ({ value, onConfirm, autoFocus }) => {
  const [inputValue, setInputValue] = useState(null);

  const shownValue = inputValue === null ? value : inputValue;

  return (
    <div>
      <TextField
        id="value-textfield"
        value={shownValue}
        onChange={(ev) => setInputValue(ev.target.value)}
        inputProps={{ autoFocus }}
      />
      <ListItemSecondaryAction>
        <IconButton
          data-testid="save"
          aria-label="save"
          onClick={() => {
            onConfirm(shownValue);
            setInputValue(null);
          }}
          size="large"
        >
          <Done color="primary" />
        </IconButton>
      </ListItemSecondaryAction>
    </div>
  );
};

EditingField.defaultProps = {
  autoFocus: false,
};

EditingField.propTypes = {
  value: string.isRequired,
  onConfirm: func.isRequired,
  autoFocus: bool,
};

export default EditingField;
