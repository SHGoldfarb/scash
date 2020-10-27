import React, { Fragment, useState } from "react";
import { elementType, func, node, string } from "prop-types";
import { Delete, Edit } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { EditingField } from "./editable-field";

const EditableField = ({
  value,
  onDelete,
  onChange,
  children,
  buttonsContainer: ButtonsContainer,
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
    />
  ) : (
    <>
      {children || value}
      <ButtonsContainer>
        <IconButton aria-label="edit" onClick={() => setIsEditing(true)}>
          <Edit color="primary" />
        </IconButton>
        <IconButton aria-label="delete" onClick={onDelete}>
          <Delete color="error" />
        </IconButton>
      </ButtonsContainer>
    </>
  );
};

EditableField.defaultProps = {
  children: null,
  buttonsContainer: Fragment,
};

EditableField.propTypes = {
  value: string.isRequired,
  onDelete: func.isRequired,
  onChange: func.isRequired,
  children: node,
  buttonsContainer: elementType,
};

export default EditableField;
