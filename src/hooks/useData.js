import { useMemo } from "react";
import { upsertById } from "utils";
import { useGlobalMemo } from "./useGlobalMemo";
import { getAll, getById, remove, upsert, clear, bulkAdd } from "../database";

export const useData = (tableName) => {
  const {
    result,
    loading,
    update: updateCache,
    reset: clearCache,
  } = useGlobalMemo(tableName, async () => getAll(tableName));

  const data = useMemo(() => result || [], [result]);

  const dataHash = useMemo(() => {
    const hash = {};
    data.forEach((item) => {
      hash[item.id] = item;
    });

    return hash;
  }, [data]);

  return {
    data,
    dataHash,
    loading: loading || !result,
    refetch: clearCache,
    upsert: async (newData) => {
      const newId = await upsert(tableName, newData);
      const newItem = await getById(tableName, newId);
      updateCache((prevItems) => upsertById(prevItems, newItem));
      return newItem;
    },
    remove: async (id) => {
      const res = await remove(tableName, id);
      clearCache();
      return res;
    },
    clear: async () => {
      const res = await clear(tableName);
      clearCache();
      return res;
    },
    bulkAdd: async (items) => {
      const res = await bulkAdd(tableName, items);
      clearCache();
      return res;
    },
    set: async (items) => {
      await clear(tableName);
      await bulkAdd(tableName, items);
      clearCache();
      return getAll(tableName);
    },
  };
};
