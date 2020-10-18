import React, { useState } from "react";
import { func, string } from "prop-types";
import { Delete, Done, Edit } from "@material-ui/icons";
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

const EditableField = ({ value, onDelete, onChange }) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <EditingField
      value={value}
      onConfirm={(newName) => {
        onChange(newName);
        setIsEditing(false);
      }}
    />
  ) : (
    <div>
      {value}
      <IconButton aria-label="edit" onClick={() => setIsEditing(true)}>
        <Edit color="primary" />
      </IconButton>
      <IconButton aria-label="delete" onClick={onDelete}>
        <Delete color="error" />
      </IconButton>
    </div>
  );
};

EditableField.propTypes = {
  value: string.isRequired,
  onDelete: func.isRequired,
  onChange: func.isRequired,
};

export default EditableField;
