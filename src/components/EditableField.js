import React, { Fragment, useState } from "react";
import { bool, elementType, func, node, string } from "prop-types";
import { Delete, Edit } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
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
        >
          <Edit color="primary" />
        </IconButton>
        <IconButton
          aria-label="delete"
          onClick={onDelete}
          disabled={disableDelete}
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
