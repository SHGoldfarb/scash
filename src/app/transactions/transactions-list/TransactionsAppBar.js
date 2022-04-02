import React from "react";
import { Link } from "react-router-dom";
import { AppBar, Button, IconButton, TextField, Toolbar } from "@mui/material";
import { styled } from "@mui/material/styles";
import { MobileDatePicker } from "@mui/lab";
import { NavigateBefore, NavigateNext } from "@mui/icons-material";
import { editPathName, makePath, transactionsPathName } from "utils";
import { useSelectedMonth } from "../hooks";

const dateFormat = "MMMM yyyy";

const StyledButton = styled(Button)(() => ({ minWidth: "10rem" }));

const TransactionsAppBar = () => {
  const [selectedMonth, setSelectedMonth] = useSelectedMonth();

  return (
    <AppBar position="sticky">
      <Toolbar
        sx={{
          "& > *": {
            "&:not(:last-child)": {
              marginRight: "auto",
            },
          },
        }}
      >
        <IconButton
          onClick={() => setSelectedMonth(selectedMonth.plus({ months: -1 }))}
        >
          <NavigateBefore />
        </IconButton>
        <MobileDatePicker
          openTo="year"
          // TODO: fix this throwing console warning then opening month view
          // views={["year", "month"]}
          // TODO: remove the inputFormat prop once the `views` issue is resolved
          inputFormat={dateFormat}
          value={selectedMonth}
          onChange={setSelectedMonth}
          renderInput={(props) => <TextField {...props} variant="standard" />}
        />

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
      </Toolbar>
    </AppBar>
  );
};

export default TransactionsAppBar;
