import React from "react";
import { Link } from "react-router-dom";
import { ListAlt, Settings } from "@material-ui/icons";
import {
  BottomNavigation,
  BottomNavigationAction,
  makeStyles,
} from "@material-ui/core";
import { makePath, settingsPathName, transactionsPathName } from "../utils";

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
        icon={<ListAlt />}
        component={Link}
        to={makePath(transactionsPathName)}
      />
      <BottomNavigationAction
        label="Settings"
        icon={<Settings />}
        component={Link}
        to={makePath(settingsPathName)}
      />
    </BottomNavigation>
  );
};

export default BottomMenu;
