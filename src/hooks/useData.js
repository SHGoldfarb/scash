import { useEffect } from "react";
import { useCache } from "../contexts";
import { getAll, getById, remove, upsert } from "../database";
import { isFunction } from "../utils/utils";

export const useReadData = (tableName, options = {}) => {
  const key = JSON.stringify({ tableName, options });

  const [cache = {}, setCache] = useCache(key);

  useEffect(() => {
    if (!cache.loading && !cache.data) {
      setCache((prev) => ({ ...prev, loading: true }));
      (async () => {
        const data = options.id
          ? await getById(tableName, options.id)
          : await getAll(tableName);

        setCache((prev) => ({ ...prev, loading: false, data }));
      })();
    }
  }, [cache, setCache, tableName, options]);

  const update = (newValue) =>
    isFunction(newValue)
      ? setCache((prev) => ({ ...prev, data: newValue(prev.data) }))
      : setCache((prev) => ({ ...prev, data: newValue }));

  return { ...cache, loading: cache.loading || !cache.data, update };
};

export const useWriteData = (tableName) => {
  return {
    upsert: async (newData) => {
      const newId = await upsert(tableName, newData);
      return getById(tableName, newId);
    },
    remove: (id) => remove(tableName, id),
  };
};
