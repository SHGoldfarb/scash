import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { bool, func, string } from "prop-types";

const EditNameDialog = ({
  open,
  onClose,
  deleted,
  onNameChange,
  onDelete,
  onRestore,
  name,
  canDelete,
}) => {
  const [currentName, setCurrentName] = useState(null);
  return (
    <Dialog onClose={onClose} open={open}>
      {deleted ? (
        <>
          <DialogTitle>Restore Objective</DialogTitle>
          <DialogActions>
            <Button
              onClick={async () => {
                await onRestore();
                onClose();
              }}
              color="success"
            >
              Restore
            </Button>
          </DialogActions>
        </>
      ) : (
        <>
          <DialogTitle>Edit Objective</DialogTitle>
          <DialogContent>
            <TextField
              value={currentName || name}
              label="name"
              inputProps={{ autoFocus: true }}
              onChange={(ev) => setCurrentName(ev.target.value)}
            />
          </DialogContent>
          <DialogActions>
            <Button
              onClick={async () => {
                onClose();
                await onDelete();
              }}
              color="error"
              disabled={!canDelete}
            >
              Delete
            </Button>
            <Button
              onClick={async () => {
                await onNameChange(currentName || name);
                onClose();
              }}
              color="success"
            >
              Save
            </Button>
          </DialogActions>
        </>
      )}
    </Dialog>
  );
};

EditNameDialog.propTypes = {
  open: bool.isRequired,
  onClose: func.isRequired,
  deleted: bool.isRequired,
  onNameChange: func.isRequired,
  onDelete: func.isRequired,
  onRestore: func.isRequired,
  name: string.isRequired,
  canDelete: bool.isRequired,
};

export default EditNameDialog;
