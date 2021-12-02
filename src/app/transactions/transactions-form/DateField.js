import React, { forwardRef } from "react";
import { Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { DateTime } from "luxon";
import { MobileDateTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { parseSearchParams } from "../../../utils";

const useDefaultDate = () => {
  const location = useLocation();

  const { month, year } = parseSearchParams(location.search);

  const currentDate = DateTime.local();

  if (`${currentDate.month}` === month && `${currentDate.year}` === year) {
    // selected month is today's month
    return currentDate;
  }

  const selectedDate = DateTime.fromObject({ month, year });

  if (currentDate > selectedDate) {
    // selected month is a past month
    return selectedDate.endOf("month");
  }

  // selected month is a future month

  return selectedDate.startOf("month");
};

const dateDisplayFormat = "yyyy-MM-dd HH:mm";

const DateField = (props) => {
  const defaultDate = useDefaultDate();
  return (
    <Controller
      as={forwardRef((pickerProps, ref) => (
        <MobileDateTimePicker
          {...pickerProps}
          renderInput={(textFieldProps) => (
            <TextField
              fullWidth
              {...textFieldProps}
              variant="filled"
              inputRef={ref}
            />
          )}
        />
      ))}
      label="Date"
      name="date"
      inputFormat={dateDisplayFormat}
      defaultValue={defaultDate}
      id="transaction-date"
      ampm={false}
      {...props}
    />
  );
};

export default DateField;
