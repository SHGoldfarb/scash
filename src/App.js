import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import { Accounts, BottomMenu, Categories } from "./app";
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
        <BottomMenu />
      </BrowserRouter>
    </DataCacheProvider>
  );
};

export default App;
