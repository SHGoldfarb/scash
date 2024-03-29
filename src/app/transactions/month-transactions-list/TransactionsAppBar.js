import React from "react";
import { Link } from "react-router-dom";
import { Button, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { editPathName, makePath, transactionsPathName } from "src/utils";
import { AppBar } from "src/components";
import { useSelectedMonth } from "../hooks";

const dateFormat = "MMMM yyyy";

const StyledButton = styled(Button)(() => ({ minWidth: "10rem" }));

const TransactionsAppBar = () => {
  const [selectedMonth, setSelectedMonth] = useSelectedMonth();

  return (
    <AppBar>
      <IconButton
        onClick={() => setSelectedMonth(selectedMonth.plus({ months: -1 }))}
      >
        <NavigateBefore />
      </IconButton>
      <Typography>{selectedMonth.toFormat(dateFormat)}</Typography>
      <IconButton
        onClick={() => setSelectedMonth(selectedMonth.plus({ months: 1 }))}
      >
        <NavigateNext />
      </IconButton>

      <StyledButton
        component={Link}
        to={makePath(transactionsPathName, editPathName, {
          params: {
            month: selectedMonth.month,
            year: selectedMonth.year,
          },
        })}
      >
        New Transaction
      </StyledButton>
    </AppBar>
  );
};

export default TransactionsAppBar;
