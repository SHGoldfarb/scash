import React from "react";
import { Accounts, Categories } from "./app";
import { DataCacheProvider } from "./contexts";

const App = () => {
  return (
    <DataCacheProvider>
      <Accounts />
      <Categories />
    </DataCacheProvider>
  );
};

export default App;
