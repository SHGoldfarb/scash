import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";
import { Favorite, Restore } from "@material-ui/icons";
import React from "react";
import { BrowserRouter, Switch, Route, Link, Redirect } from "react-router-dom";
import { Accounts, Categories } from "./app";
import { DataCacheProvider } from "./contexts";

const App = () => {
  return (
    <DataCacheProvider>
      <BrowserRouter>
        <Switch>
          <Route path="/configuration">
            <Accounts />
            <Categories />
          </Route>
          <Route path="/transactions">Hola!</Route>
          <Route path="/">
            <Redirect to="/transactions" />
          </Route>
        </Switch>
        <BottomNavigation showLabels>
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
      </BrowserRouter>
    </DataCacheProvider>
  );
};

export default App;
