import React, { useState } from "react";
import { Add } from "@mui/icons-material";
import { IconButton, List, ListItem, ListItemText } from "@mui/material";
import { arrayOf, bool, func, node, number, shape, string } from "prop-types";
import EditableField from "./EditableField";
import EditingField from "./EditingField";

const EditableList = ({ source, onAdd }) => {
  const [isAddingNew, setIsAddingNew] = useState(false);
  return (
    <List>
      {source.map((item) => (
        <ListItem key={item.id}>
          <EditableField
            value={item.label}
            onDelete={item.onRemove}
            onChange={item.onUpdate}
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
      onRemove: func,
      onUpdate: func,
    })
  ).isRequired,

  onAdd: func.isRequired,
};

export default EditableList;
