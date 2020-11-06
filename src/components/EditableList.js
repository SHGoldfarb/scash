import React from "react";
import { Add } from "@material-ui/icons";
import {
  IconButton,
  List,
  ListItem,
  ListItemSecondaryAction,
  ListItemText,
} from "@material-ui/core";
import { arrayOf, func, number, shape, string } from "prop-types";
import EditableField from "./EditableField";

const EditableList = ({ source, onUpdate, onAdd, onRemove }) => {
  return (
    <List>
      {source.map((item) => (
        <ListItem key={item.id}>
          <EditableField
            value={item.label}
            onDelete={() => onRemove(item)}
            onChange={(label) => onUpdate({ ...item, label })}
            buttonsContainer={ListItemSecondaryAction}
          >
            <ListItemText primary={item.label} />
          </EditableField>
        </ListItem>
      ))}
      <IconButton
        aria-label="Create"
        onClick={() => onAdd({ label: "New Account" })}
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
    })
  ).isRequired,
  onUpdate: func.isRequired,
  onAdd: func.isRequired,
  onRemove: func.isRequired,
};

export default EditableList;
