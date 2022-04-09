import React, { useState } from "react";
import { bool, func, node, string } from "prop-types";
import { Delete, Edit, RestoreFromTrash } from "@mui/icons-material";
import { IconButton, ListItemSecondaryAction } from "@mui/material";
import EditingField from "./EditingField";

const EditableField = ({
  value,
  onDelete,
  onChange,
  children,
  autoFocus,
  disableDelete,
  locked,
  onUnlock,
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
        {locked ? (
          <IconButton
            aria-label="lockOpen"
            onClick={onUnlock}
            data-testid="lockOpen"
            size="large"
          >
            <RestoreFromTrash color="success" />
          </IconButton>
        ) : (
          <>
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
          </>
        )}
      </ListItemSecondaryAction>
    </>
  );
};

EditableField.defaultProps = {
  children: null,
  autoFocus: false,
  disableDelete: false,
  locked: false,
  onUnlock: () => {},
};

EditableField.propTypes = {
  value: string.isRequired,
  onDelete: func.isRequired,
  onChange: func.isRequired,
  children: node,
  autoFocus: bool,
  disableDelete: bool,
  locked: bool,
  onUnlock: func,
};

export default EditableField;
