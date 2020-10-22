import { useEffect } from "react";
import { useCache } from "../contexts";
import db from "../database";
import { isFunction } from "../utils/utils";

export const useReadData = (tableName, options = {}) => {
  const key = JSON.stringify({ tableName, options });

  const [cache = {}, setCache] = useCache(key);

  useEffect(() => {
    if (!cache.loading && !cache.data) {
      setCache((prev) => ({ ...prev, loading: true }));
      (async () => {
        const data = await db.table(tableName).toArray();
        setCache((prev) => ({ ...prev, loading: false, data }));
      })();
    }
  }, [cache, setCache, tableName]);

  const update = (newValue) =>
    isFunction(newValue)
      ? setCache((prev) => ({ ...prev, data: newValue(prev.data) }))
      : setCache((prev) => ({ ...prev, data: newValue }));

  return { ...cache, loading: cache.loading || !cache.data, update };
};

export const useWriteData = (tableName) => {
  const upsert = (newData) => db.table(tableName).put(newData);
  const remove = (id) => db.table(tableName).delete(id);
  return { upsert, remove };
};
