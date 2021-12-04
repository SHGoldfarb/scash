import React from "react";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
} from "@mui/material/styles";
import { node } from "prop-types";

const theme = createTheme({
  palette: {
    mode: "dark",
  },
});

const ScashThemeProvider = ({ children }) => {
  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </StyledEngineProvider>
  );
};

ScashThemeProvider.propTypes = {
  children: node.isRequired,
};

export default ScashThemeProvider;
