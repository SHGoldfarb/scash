import React, { useState } from "react";
import { Button, ListItem, ListItemButton, Typography } from "@mui/material";
import { bool, func, number, string } from "prop-types";
import { currencyFormat } from "utils";
import { EditAmountDialog, EditNameDialog } from "./item";

const Item = ({
  amount,
  label,
  closed,
  onNameChange,
  onClose,
  onOpen,
  onAmountChange,
}) => {
  const [amountDialogOpen, setAmountDialogOpen] = useState(false);
  const [nameDialogOpen, setNameDialogOpen] = useState(false);
  return (
    <>
      {amountDialogOpen ? (
        <EditAmountDialog
          onClose={() => setAmountDialogOpen(false)}
          open
          onAmountChange={onAmountChange}
        />
      ) : null}

      {nameDialogOpen ? (
        <EditNameDialog
          onClose={() => setNameDialogOpen(false)}
          open
          deleted={closed}
          onNameChange={onNameChange}
          onDelete={onClose}
          onRestore={onOpen}
          name={label}
          canDelete={amount === 0}
        />
      ) : null}
      <ListItem
        secondaryAction={
          <Button
            color={amount < 0 ? "error" : "success"}
            onClick={() =>
              onAmountChange && !closed && setAmountDialogOpen(true)
            }
          >
            {currencyFormat(amount)}
          </Button>
        }
      >
        <ListItemButton
          component="div"
          onClick={() => onNameChange && setNameDialogOpen(true)}
        >
          <Typography color={closed ? "textSecondary" : "textPrimary"}>
            {label}
          </Typography>
        </ListItemButton>
      </ListItem>
    </>
  );
};

Item.defaultProps = {
  closed: false,
  onNameChange: null,
  onClose: null,
  onOpen: null,
  onAmountChange: null,
};

Item.propTypes = {
  amount: number.isRequired,
  label: string.isRequired,
  closed: bool,
  onNameChange: func,
  onClose: func,
  onOpen: func,
  onAmountChange: func,
};

export default Item;
