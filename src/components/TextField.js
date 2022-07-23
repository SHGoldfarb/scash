import React, { forwardRef } from "react";
import { TextField as MuiTextField } from "@mui/material";
import { shape } from "prop-types";

const TextField = forwardRef(({ SelectProps, ...props }, ref) => {
  return (
    <MuiTextField
      SelectProps={{
        ...SelectProps,
        MenuProps: {
          ...SelectProps?.MenuProps,
          PaperProps: {
            ...SelectProps?.MenuProps?.PaperProps,
            sx: {
              ...SelectProps?.MenuProps?.PaperProps?.sx,
              left: "0px !important",
            },
          },
        },
      }}
      {...props}
      ref={ref}
    />
  );
});

TextField.defaultProps = {
  SelectProps: {},
};

TextField.propTypes = {
  SelectProps: shape({
    MenuProps: shape({ PaperProps: shape({ sx: shape() }) }),
  }),
};

export default TextField;
