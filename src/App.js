import LuxonUtils from "@date-io/luxon";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {
  Accounts,
  Background,
  BottomMenu,
  Categories,
  ScashThemeProvider,
  Transactions,
} from "./app";
import { DataCacheProvider } from "./contexts";
import { makePath, settingsPathName, transactionsPathName } from "./utils";
import "./app.css";

const App = () => {
  return (
    <ScashThemeProvider>
      <Background>
        <MuiPickersUtilsProvider utils={LuxonUtils}>
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
        </MuiPickersUtilsProvider>
      </Background>
    </ScashThemeProvider>
  );
};

export default App;
