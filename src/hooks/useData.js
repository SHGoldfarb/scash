import { useMemo } from "react";
import { upsertById } from "utils";
import { useGlobalMemo } from "./useGlobalMemo";
import { getAll, getById, remove, upsert, clear, bulkAdd } from "../database";

export const useData = (tableName) => {
  const {
    result: data = [],
    loading,
    update: updateCache,
    reset: clearCache,
  } = useGlobalMemo(tableName, async () => getAll(tableName));

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
    loading: loading || !data,
    refetch: clearCache,
    upsert: async (newData) => {
      const newId = await upsert(tableName, newData);
      const newItem = await getById(tableName, newId);
      updateCache((prevItems) => upsertById(prevItems, newItem));
      return newItem;
    },
    remove: async (id) => {
      const result = await remove(tableName, id);
      clearCache();
      return result;
    },
    clear: async () => {
      const result = await clear(tableName);
      clearCache();
      return result;
    },
    bulkAdd: async (items) => {
      const result = await bulkAdd(tableName, items);
      clearCache();
      return result;
    },
    set: async (items) => {
      await clear(tableName);
      await bulkAdd(tableName, items);
      clearCache();
      return getAll(tableName);
    },
  };
};
