import React, { useState } from "react";
import { func, string } from "prop-types";
import { Delete, Edit } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { EditingField } from "./editable-field";

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
