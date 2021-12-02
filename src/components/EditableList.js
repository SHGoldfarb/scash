import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@mui/material";
import { arrayOf, bool, func, node, number, shape, string } from "prop-types";
import EditableField from "./EditableField";
import EditingField from "./EditingField";

const EditableList = ({ source, onUpdate, onAdd, onRemove }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  return (
    <List>
      {source.map((item) => (
        <ListItem key={item.id}>
          <EditableField
            value={item.label}
            onDelete={() => onRemove(item)}
            onChange={(label) => onUpdate({ ...item, label })}
            buttonsContainer={ListItemSecondaryAction}
            autoFocus
            disableDelete={item.disableDelete}
          >
            <ListItemText
              primary={item.label}
              primaryTypographyProps={{ color: "textPrimary" }}
              secondary={item.sublabel}
            />
          </EditableField>
        </ListItem>
      ))}
      {isAddingNew && (
        <ListItem>
          <EditingField
            value=""
            onConfirm={(newName) => {
              onAdd({ label: newName });
              setIsAddingNew(false);
            }}
            renderConfirmButton={(buttonNode) => (
              <ListItemSecondaryAction>{buttonNode}</ListItemSecondaryAction>
            )}
            autoFocus
          />
        </ListItem>
      )}
      <IconButton
        aria-label="Create"
        onClick={() => setIsAddingNew(true)}
        size="large"
      >
        <Add color="primary" />
      </IconButton>
    </List>
  );
};

EditableList.propTypes = {
  source: arrayOf(
    shape({
      id: number.isRequired,
      label: string.isRequired,
      sublabel: node,
      disableDelete: bool,
    })
  ).isRequired,
  onUpdate: func.isRequired,
  onAdd: func.isRequired,
  onRemove: func.isRequired,
};

export default EditableList;
