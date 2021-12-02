import React from "react";
import makeStyles from "@mui/styles/makeStyles";
import { node } from "prop-types";

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.background.default,
    minHeight: "100vh",
  },
}));

const Background = ({ children }) => {
  const classes = useStyles();
  return <div className={classes.root}>{children}</div>;
};

Background.propTypes = {
  children: node.isRequired,
};

export default Background;
