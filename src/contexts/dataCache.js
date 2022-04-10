import React, { createContext, useContext, useState } from "react";
import { node } from "prop-types";
import { isFunction } from "../lib";

const DataCacheValueContext = createContext({});
const DataCacheSetterContext = createContext(() => {});

export const makeSetCacheValue = (setCache, key) => (value) => {
  if (isFunction(value)) {
    setCache((prev) => ({
      ...prev,
      [key]: value(prev[key]),
    }));
  } else {
    setCache((prev) => ({ ...prev, [key]: value }));
  }
};

export const DataCacheProvider = ({ children }) => {
  const [cache, setCache] = useState({});

  return (
    <DataCacheValueContext.Provider value={cache}>
      <DataCacheSetterContext.Provider value={setCache}>
        {children}
      </DataCacheSetterContext.Provider>
    </DataCacheValueContext.Provider>
  );
};

DataCacheProvider.propTypes = { children: node.isRequired };

export const useCache = (key) => {
  const cache = useContext(DataCacheValueContext);
  const setCache = useContext(DataCacheSetterContext);

  if (key === undefined) {
    return [cache, setCache];
  }

  return [cache[key], makeSetCacheValue(setCache, key)];
};
