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
import { useReadData, useWriteData } from "hooks";
import { DelayedCircularProgress } from "components";
import { upsertById } from "utils";

const NewObjectiveModal = ({ onClose }) => {
  const [name, setName] = useState("");

  const { update, loading } = useReadData("categories");
  const { upsert } = useWriteData("categories");

  const handleCreate = async () => {
    const returnedCategory = await upsert({ name });
    update((categories) => upsertById(categories, returnedCategory));
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
