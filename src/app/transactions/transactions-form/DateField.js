import React from "react";
import { Controller } from "react-hook-form";
import { useLocation } from "react-router-dom";
import { DateTime } from "luxon";
import { MobileDateTimePicker } from "@mui/lab";
import { TextField } from "@mui/material";
import { shape } from "prop-types";
import { parseSearchParams } from "../../../utils";

const useDefaultDate = () => {
  const location = useLocation();

  const { month, year, day } = parseSearchParams(location.search);

  const currentDate = DateTime.now();

  if (month && year && day) {
    return DateTime.fromObject({
      year,
      month,
      day,
      hour: currentDate.hour,
      minute: currentDate.minute,
      second: currentDate.second,
    });
  }

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

const DateField = ({ control }) => {
  const defaultDate = useDefaultDate().toSeconds();
  return (
    <Controller
      render={({ field: { ref, value, onChange, ...pickerProps } }) => (
        <MobileDateTimePicker
          {...pickerProps}
          onChange={(newValue) => onChange(newValue.toSeconds())}
          value={value ? DateTime.fromSeconds(value) : null}
          label="Date"
          inputFormat={dateDisplayFormat}
          renderInput={(textFieldProps) => (
            <TextField
              fullWidth
              {...textFieldProps}
              variant="filled"
              inputRef={ref}
            />
          )}
        />
      )}
      name="date"
      defaultValue={defaultDate}
      id="transaction-date"
      ampm={false}
      control={control}
    />
  );
};

DateField.propTypes = {
  control: shape().isRequired,
};

export default DateField;
