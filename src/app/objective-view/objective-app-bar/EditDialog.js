import React from "react";
import { Dialog, DialogTitle } from "@mui/material";
import { bool, func } from "prop-types";
import { EditName, MergeObjective } from "./edit-dialog";

const EditDialog = ({ open, onClose }) => {
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Edit Objective</DialogTitle>
      <EditName onEdit={onClose} />
      <MergeObjective />
    </Dialog>
  );
};

EditDialog.propTypes = {
  open: bool.isRequired,
  onClose: func.isRequired,
};

export default EditDialog;
