import React from "react";
import { styled } from "@mui/material/styles";
import { node } from "prop-types";

const PREFIX = "PageContainer";

const classes = {
  bottomNavigationBarHeight: `${PREFIX}-bottomNavigationBarHeight`,
};

const Root = styled("div")({
  [`& .${classes.bottomNavigationBarHeight}`]: { height: "56px" },
});

const PageContainer = ({ children }) => {
  return (
    <Root>
      {children}
      <div className={classes.bottomNavigationBarHeight} />
    </Root>
  );
};

PageContainer.propTypes = {
  children: node.isRequired,
};

export default PageContainer;
