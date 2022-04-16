import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { bool, func } from "prop-types";
import { isEnterKey } from "utils";

const EditAmountDialog = ({ open, onClose, onAmountChange }) => {
  const [currentAmount, setCurrentAmount] = useState("");
  const handleAdd = () => {
    onAmountChange(parseInt(currentAmount, 10));
    onClose();
  };
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Add or Subtract Amount</DialogTitle>
      <DialogContent>
        <TextField
          value={currentAmount}
          label="Amount"
          type="number"
          inputProps={{ autoFocus: true }}
          onChange={(ev) => setCurrentAmount(ev.target.value)}
          onKeyPress={(ev) => {
            if (isEnterKey(ev)) {
              handleAdd();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onAmountChange(-parseInt(currentAmount, 10));
            onClose();
          }}
          color="error"
        >
          Subtract
        </Button>
        <Button onClick={handleAdd} color="success">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditAmountDialog.propTypes = {
  open: bool.isRequired,
  onClose: func.isRequired,
  onAmountChange: func.isRequired,
};

export default EditAmountDialog;
