import React from "react";
import { AppBar as MuiAppBar, Toolbar } from "@mui/material";
import { TRANSACTIONS_APPBAR_HEIGHT_PX } from "src/utils";
import { node, shape } from "prop-types";

const AppBar = ({
  AppBarProps,
  ToolBarProps: { sx, ...restToolBarProps },
  children,
}) => {
  return (
    <MuiAppBar position="sticky" {...AppBarProps}>
      <Toolbar
        sx={{
          minHeight: `${TRANSACTIONS_APPBAR_HEIGHT_PX}px`,
          height: `${TRANSACTIONS_APPBAR_HEIGHT_PX}px`,
          padding: 0,
          "& > *": {
            "&:not(:last-child)": {
              marginRight: "auto",
            },
          },
          ...sx,
        }}
        {...restToolBarProps}
      >
        {children}
      </Toolbar>
    </MuiAppBar>
  );
};

AppBar.defaultProps = {
  AppBarProps: {},
  ToolBarProps: {},
  children: null,
};

AppBar.propTypes = {
  AppBarProps: shape(),
  ToolBarProps: shape({ sx: shape() }),
  children: node,
};

export default AppBar;
