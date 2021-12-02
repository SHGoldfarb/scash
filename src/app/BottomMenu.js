import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ListAlt, Settings } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
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

  const { pathname } = useLocation();

  const currentLocationValue =
    (pathname.includes(transactionsPathName) && transactionsPathName) ||
    (pathname.includes(settingsPathName) && settingsPathName) ||
    null;

  return (
    <BottomNavigation
      showLabels
      classes={{ root: classes.bottomNavigation }}
      value={currentLocationValue}
    >
      <BottomNavigationAction
        label="Transactions"
        icon={<ListAlt />}
        component={Link}
        to={makePath(transactionsPathName)}
        value={transactionsPathName}
      />
      <BottomNavigationAction
        label="Settings"
        icon={<Settings />}
        component={Link}
        to={makePath(settingsPathName)}
        value={settingsPathName}
      />
    </BottomNavigation>
  );
};

export default BottomMenu;
