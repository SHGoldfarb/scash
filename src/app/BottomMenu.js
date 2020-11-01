import React from "react";
import { Link } from "react-router-dom";
import { Favorite, Restore } from "@material-ui/icons";
import {
  BottomNavigation,
  BottomNavigationAction,
  makeStyles,
} from "@material-ui/core";

const useStyles = makeStyles(() => ({
  bottomNavigation: {
    bottom: 0,
    position: "fixed",
    width: "100%",
  },
}));

const BottomMenu = () => {
  const classes = useStyles();

  return (
    <BottomNavigation showLabels classes={{ root: classes.bottomNavigation }}>
      <BottomNavigationAction
        label="Transactions"
        icon={<Restore />}
        component={Link}
        to="/transactions"
      />
      <BottomNavigationAction
        label="Settings"
        icon={<Favorite />}
        component={Link}
        to="/configuration"
      />
    </BottomNavigation>
  );
};

export default BottomMenu;
