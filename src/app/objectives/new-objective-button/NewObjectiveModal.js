import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { func } from "prop-types";
import { useData } from "hooks";
import { DelayedCircularProgress } from "components";

const NewObjectiveModal = ({ onClose }) => {
  const [name, setName] = useState("");

  const { upsert, loading } = useData("objectives");

  const handleCreate = async () => {
    await upsert({ name });
  };

  if (loading) {
    return <DelayedCircularProgress />;
  }

  return (
    <>
      <Dialog onClose={onClose} open>
        <DialogTitle>Create Objective</DialogTitle>
        <DialogContent>
          <TextField
            value={name}
            label="Name"
            inputProps={{ autoFocus: true }}
            onChange={(ev) => setName(ev.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={async () => {
              await handleCreate();
              onClose();
            }}
            color="success"
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

NewObjectiveModal.propTypes = {
  onClose: func.isRequired,
};

export default NewObjectiveModal;
