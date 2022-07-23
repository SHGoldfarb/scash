import React from "react";
import { MenuItem } from "@mui/material";

export const renderAccountAsMenuItem = (account) => (
  <MenuItem value={account.id} key={account.id}>
    {account.name}
  </MenuItem>
);
