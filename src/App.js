import AdapterLuxon from "@mui/lab/AdapterLuxon";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {
  Accounts,
  Background,
  BottomMenu,
  Categories,
  Commands,
  IncomeCategories,
  PageContainer,
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
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DataCacheProvider>
            <BrowserRouter>
              <PageContainer>
                <Switch>
                  <Route path={makePath(settingsPathName)}>
                    <Commands />
                    <Accounts />
                    <Categories />
                    <IncomeCategories />
                  </Route>
                  <Route path={makePath(transactionsPathName)}>
                    <Transactions />
                  </Route>
                  <Route path={makePath()}>
                    <Redirect to={makePath(transactionsPathName)} />
                  </Route>
                </Switch>
              </PageContainer>
              <BottomMenu />
            </BrowserRouter>
          </DataCacheProvider>
        </LocalizationProvider>
      </Background>
    </ScashThemeProvider>
  );
};

export default App;
