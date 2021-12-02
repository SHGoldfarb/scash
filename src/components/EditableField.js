import React, { Fragment, useState } from "react";
import { bool, elementType, func, node, string } from "prop-types";
import { Delete, Edit } from "@mui/icons-material";
import { IconButton } from "@mui/material";
import EditingField from "./EditingField";

const EditableField = ({
  value,
  onDelete,
  onChange,
  children,
  buttonsContainer: ButtonsContainer,
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
      renderConfirmButton={(buttonNode) => (
        <ButtonsContainer>{buttonNode}</ButtonsContainer>
      )}
      autoFocus={autoFocus}
    />
  ) : (
    <>
      {children || value}
      <ButtonsContainer>
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
      </ButtonsContainer>
    </>
  );
};

EditableField.defaultProps = {
  children: null,
  buttonsContainer: Fragment,
  autoFocus: false,
  disableDelete: false,
};

EditableField.propTypes = {
  value: string.isRequired,
  onDelete: func.isRequired,
  onChange: func.isRequired,
  children: node,
  buttonsContainer: elementType,
  autoFocus: bool,
  disableDelete: bool,
};

export default EditableField;
