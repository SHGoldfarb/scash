import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from "@mui/material";
import { bool, func, number } from "prop-types";
import { isEnterKey } from "src/utils";

const EditAmountDialog = ({
  open,
  onClose,
  onAmountChange,
  currentBalance,
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleAdd = () => {
    onAmountChange((prevAmount) => prevAmount + parseInt(inputValue, 10));
    onClose();
  };
  const handleSubstract = () => {
    onAmountChange((prevAmount) => prevAmount - parseInt(inputValue, 10));
    onClose();
  };
  const handleSet = () => {
    onAmountChange(
      (prevAmount) => prevAmount - currentBalance + parseInt(inputValue, 10)
    );
    onClose();
  };
  return (
    <Dialog onClose={onClose} open={open}>
      <DialogTitle>Add or Subtract Amount</DialogTitle>
      <DialogContent>
        <TextField
          value={inputValue}
          label="Amount"
          type="number"
          inputProps={{ autoFocus: true }}
          onChange={(ev) => setInputValue(ev.target.value)}
          onKeyPress={(ev) => {
            if (isEnterKey(ev)) {
              handleSet();
            }
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleSubstract} color="error">
          Subtract
        </Button>
        <Button onClick={handleAdd} color="success">
          Add
        </Button>
        <Button onClick={handleSet} color="primary">
          Set
        </Button>
      </DialogActions>
    </Dialog>
  );
};

EditAmountDialog.propTypes = {
  open: bool.isRequired,
  onClose: func.isRequired,
  onAmountChange: func.isRequired,
  currentBalance: number.isRequired,
};

export default EditAmountDialog;
