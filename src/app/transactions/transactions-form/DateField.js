import React from "react";
import { DateTime } from "luxon";
import { MobileDateTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { useTransactionFormContext } from "../contexts";

const dateDisplayFormat = "yyyy-MM-dd HH:mm";
const name = "date";

const DateField = () => {
  const { values: { date } = {}, setField } = useTransactionFormContext();

  return (
    <MobileDateTimePicker
      onChange={(newValue) => setField(name)(newValue.toSeconds())}
      value={date ? DateTime.fromSeconds(date) : null}
      label="Date"
      inputFormat={dateDisplayFormat}
      name={name}
      id="transaction-date"
      ampm={false}
      renderInput={(textFieldProps) => (
        <TextField fullWidth {...textFieldProps} variant="filled" />
      )}
    />
  );
};

export default DateField;
