import React from "react";
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from "@mui/material/styles";
import { node } from "prop-types";

const theme = createTheme(
  adaptV4Theme({
    palette: {
      mode: "dark",
    },
  })
);

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
