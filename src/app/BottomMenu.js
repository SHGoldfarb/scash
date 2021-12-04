import React from "react";
import { styled } from "@mui/material/styles";
import { Link, useLocation } from "react-router-dom";
import { ListAlt, Settings } from "@mui/icons-material";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
import { makePath, settingsPathName, transactionsPathName } from "../utils";

const StyledBottomNavigation = styled(BottomNavigation)(() => ({
  bottom: 0,
  position: "fixed",
  width: "100%",
}));

const BottomMenu = () => {
  const { pathname } = useLocation();

  const currentLocationValue =
    (pathname.includes(transactionsPathName) && transactionsPathName) ||
    (pathname.includes(settingsPathName) && settingsPathName) ||
    null;

  return (
    <StyledBottomNavigation showLabels value={currentLocationValue}>
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
    </StyledBottomNavigation>
  );
};

export default BottomMenu;
