import { useEffect } from "react";
import { makeSetCacheValue, useCache } from "../contexts";
import { isFunction } from "../lib";

export const usePerformNewGlobalMemoCalculations = () => {
  const [cache, setCache] = useCache();
  useEffect(() => {
    const keys = Object.keys(cache).filter((key) =>
      key.includes("globalMemo-")
    );

    keys.forEach((key) => {
      const data = cache[key];
      const setCacheValue = makeSetCacheValue(setCache, key);
      if (!data.loading && !data.executed) {
        setCacheValue((prev) => ({ ...prev, loading: true }));
        (async () => {
          const result = await data.performCalculation();
          setCacheValue((prev) => ({
            ...prev,
            result,
            loading: false,
            executed: true,
          }));
        })();
      }
    });
  }, [cache, setCache]);
};

export const useGlobalMemo = (key, performCalculation) => {
  const [cache, setCache] = useCache(`globalMemo-${key}`);
  useEffect(() => {
    if (!cache) {
      setCache((prev) => ({ ...prev, performCalculation }));
    }
  }, [cache, setCache, performCalculation]);

  const update = (newValue) =>
    isFunction(newValue)
      ? setCache((prev) => ({ ...prev, result: newValue(prev.result) }))
      : setCache((prev) => ({ ...prev, result: newValue }));

  const reset = () => setCache({ performCalculation });

  return { ...cache, update, reset };
};
