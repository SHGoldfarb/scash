import React, { useState } from "react";
import { bool, func, string } from "prop-types";
import { Done } from "@material-ui/icons";
import { IconButton, TextField } from "@material-ui/core";

const EditingField = ({ value, onConfirm, renderConfirmButton, autoFocus }) => {
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
      {renderConfirmButton(
        <IconButton
          aria-label="save"
          onClick={() => {
            onConfirm(shownValue);
            setInputValue(null);
          }}
        >
          <Done color="primary" />
        </IconButton>
      )}
    </div>
  );
};

EditingField.defaultProps = {
  renderConfirmButton: (children) => children,
  autoFocus: false,
};

EditingField.propTypes = {
  value: string.isRequired,
  onConfirm: func.isRequired,
  renderConfirmButton: func,
  autoFocus: bool,
};

export default EditingField;
