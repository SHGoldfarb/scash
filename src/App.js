import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Accounts, BottomMenu, Categories, Transactions } from "./app";
import { DataCacheProvider } from "./contexts";
import { makePath, settingsPathName, transactionsPathName } from "./utils";

const App = () => {
  return (
    <DataCacheProvider>
      <BrowserRouter>
        <Switch>
          <Route path={makePath(settingsPathName)}>
            <Accounts />
            <Categories />
          </Route>
          <Route path={makePath(transactionsPathName)}>
            <Transactions />
          </Route>
          <Route path={makePath()}>
            <Redirect to={makePath(transactionsPathName)} />
          </Route>
        </Switch>
        <BottomMenu />
      </BrowserRouter>
    </DataCacheProvider>
  );
};

export default App;
