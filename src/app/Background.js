import React from "react";
import { styled } from "@mui/material/styles";
import { node } from "prop-types";

const Root = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: "100vh",
}));

const Background = ({ children }) => {
  return <Root>{children}</Root>;
};

Background.propTypes = {
  children: node.isRequired,
};

export default Background;
