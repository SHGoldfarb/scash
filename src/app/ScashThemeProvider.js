import React from "react";
import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";
import { node } from "prop-types";

const theme = createMuiTheme({
  palette: {
    type: "dark",
  },
});

const ScashThemeProvider = ({ children }) => {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

ScashThemeProvider.propTypes = {
  children: node.isRequired,
};

export default ScashThemeProvider;
