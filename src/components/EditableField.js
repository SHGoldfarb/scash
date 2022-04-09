import React, { useState } from "react";
import { bool, func, node, string } from "prop-types";
import { Delete, Edit } from "@mui/icons-material";
import { IconButton, ListItemSecondaryAction } from "@mui/material";
import EditingField from "./EditingField";

const EditableField = ({
  value,
  onDelete,
  onChange,
  children,

  autoFocus,
  disableDelete,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  return isEditing ? (
    <EditingField
      value={value}
      onConfirm={(newName) => {
        onChange(newName);
        setIsEditing(false);
      }}
      autoFocus={autoFocus}
    />
  ) : (
    <>
      {children || value}
      <ListItemSecondaryAction>
        <IconButton
          aria-label="edit"
          onClick={() => setIsEditing(true)}
          data-testid="edit"
          size="large"
        >
          <Edit color="primary" />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={onDelete}
          disabled={disableDelete}
          size="large"
        >
          <Delete color={disableDelete ? "disabled" : "error"} />
        </IconButton>
      </ListItemSecondaryAction>
    </>
  );
};

EditableField.defaultProps = {
  children: null,
  autoFocus: false,
  disableDelete: false,
};

EditableField.propTypes = {
  value: string.isRequired,
  onDelete: func.isRequired,
  onChange: func.isRequired,
  children: node,
  autoFocus: bool,
  disableDelete: bool,
};

export default EditableField;
