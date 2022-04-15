import { useGlobalMemo } from "./useGlobalMemo";
import { isFunction } from "../lib";
import { getAll, getById, remove, upsert, clear, bulkAdd } from "../database";

export const useReadData = (tableName) => {
  const { result, loading, update, reset } = useGlobalMemo(
    tableName,
    async () => {
      const dataArray = await getAll(tableName);
      const dataHash = {};
      dataArray.forEach((item) => {
        dataHash[item.id] = item;
      });

      return { dataArray, dataHash };
    }
  );

  const updateResult = (newValue) =>
    update((prev) => {
      const newDataArray = isFunction(newValue)
        ? newValue(prev?.dataArray)
        : newValue;
      const newDataHash = {};
      newDataArray.forEach((item) => {
        newDataHash[item.id] = item;
      });

      return { dataArray: newDataArray, dataHash: newDataHash };
    });

  return {
    data: result?.dataArray,
    dataHash: result?.dataHash,
    loading: loading || !result,
    update: updateResult,
    refetch: reset,
  };
};

export const useWriteData = (tableName) => {
  return {
    upsert: async (newData) => {
      const newId = await upsert(tableName, newData);
      return getById(tableName, newId);
    },
    remove: (id) => remove(tableName, id),
    clear: () => clear(tableName),
    bulkAdd: (items) => bulkAdd(tableName, items),
    set: async (items) => {
      await clear(tableName);
      await bulkAdd(tableName, items);
      return getAll(tableName);
    },
  };
};
