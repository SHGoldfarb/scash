import AdapterLuxon from "@mui/lab/AdapterLuxon";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import {
  Accounts,
  Background,
  BottomMenu,
  Commands,
  ExcelToJsonButton,
  ExportToJsonButton,
  IncomeSources,
  Objectives,
  PageContainer,
  RestoreFromJsonButton,
  ScashThemeProvider,
  Transactions,
  UniversalMemo,
} from "./app";
import { DataCacheProvider } from "./contexts";
import {
  makePath,
  objectivesPathName,
  settingsPathName,
  transactionsPathName,
} from "./utils";
import "./app.css";

const App = () => {
  return (
    <ScashThemeProvider>
      <Background>
        <LocalizationProvider dateAdapter={AdapterLuxon}>
          <DataCacheProvider>
            <UniversalMemo />
            <BrowserRouter>
              <PageContainer>
                <Switch>
                  <Route path={makePath(settingsPathName)}>
                    <Commands />
                    <Accounts />
                    <IncomeSources />
                    <RestoreFromJsonButton />
                    <ExcelToJsonButton />
                    <ExportToJsonButton />
                  </Route>
                  <Route path={makePath(transactionsPathName)}>
                    <Transactions />
                  </Route>
                  <Route path={makePath(objectivesPathName)}>
                    <Objectives />
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
