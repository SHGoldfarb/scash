import React from "react";
import { makeStyles } from "@material-ui/core";
import { node } from "prop-types";

const useStyles = makeStyles({ bottomNavigationBarHeight: { height: "56px" } });

const PageContainer = ({ children }) => {
  const classes = useStyles();
  return (
    <div>
      {children}
      <div className={classes.bottomNavigationBarHeight} />
    </div>
  );
};

PageContainer.propTypes = {
  children: node.isRequired,
};

export default PageContainer;
