import React from "react";
import { Button, ListItem, ListItemButton, Typography } from "@mui/material";
import { bool, func, number, string } from "prop-types";
import { currencyFormat } from "utils";

const Item = ({ amount, label, closed, onLabelClick, onAmountClick }) => {
  return (
    <>
      <ListItem
        secondaryAction={
          <Button
            color={amount < 0 ? "error" : "success"}
            onClick={onAmountClick}
          >
            {currencyFormat(amount)}
          </Button>
        }
      >
        <ListItemButton component="div" onClick={onLabelClick}>
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
  onAmountClick: () => {},
  onLabelClick: () => {},
};

Item.propTypes = {
  amount: number.isRequired,
  label: string.isRequired,
  closed: bool,
  onAmountClick: func,
  onLabelClick: func,
};

export default Item;