import React, { useState } from "react";
import { bool, func, string } from "prop-types";
import { Done } from "@mui/icons-material";
import { IconButton, ListItemSecondaryAction, TextField } from "@mui/material";
import { isEnterKey } from "utils";

const EditingField = ({ value, onConfirm, autoFocus }) => {
  const [inputValue, setInputValue] = useState(null);

  const shownValue = inputValue === null ? value : inputValue;

  const handleConfirm = () => {
    onConfirm(shownValue);
    setInputValue(null);
  };

  return (
    <div>
      <TextField
        id="value-textfield"
        value={shownValue}
        onChange={(ev) => setInputValue(ev.target.value)}
        onKeyPress={(ev) => {
          if (isEnterKey(ev)) {
            handleConfirm();
          }
        }}
        inputProps={{ autoFocus }}
      />
      <ListItemSecondaryAction>
        <IconButton
          data-testid="save"
          aria-label="save"
          onClick={handleConfirm}
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
