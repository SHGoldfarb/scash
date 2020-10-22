import React from "react";
import { Accounts } from "./app";
import { DataCacheProvider } from "./contexts";

const App = () => {
  return (
    <DataCacheProvider>
      <Accounts />
    </DataCacheProvider>
  );
};

export default App;
