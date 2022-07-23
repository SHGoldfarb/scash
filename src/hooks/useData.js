import { useMemo } from "react";
import { upsertById } from "src/utils";
import { useGlobalMemo } from "./useGlobalMemo";
import {
  getAll,
  getById,
  remove,
  upsert,
  clear,
  bulkAdd,
  bulkGet,
} from "../database";

const withHandleStateUpdate = (updateFunction) => async (
  updateParam,
  { lazyStateUpdate = false } = {}
) => {
  const { result, updateState } = await updateFunction(updateParam);

  if (lazyStateUpdate) {
    return { result, updateState };
  }

  updateState();
  return result;
};

export const useData = (tableName) => {
  const {
    result: memoizedData,
    loading,
    update: updateCache,
    reset: clearCache,
  } = useGlobalMemo(tableName, async () => getAll(tableName));

  const data = useMemo(() => memoizedData || [], [memoizedData]);

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
    loading: loading || !memoizedData,
    refetch: clearCache,
    upsert: withHandleStateUpdate(async (newData) => {
      const newId = await upsert(tableName, newData);
      const newItem = await getById(tableName, newId);

      return {
        result: newItem,
        updateState: () =>
          updateCache((prevItems) => upsertById(prevItems, newItem)),
      };
    }),
    remove: withHandleStateUpdate(async (id) => {
      return {
        result: await remove(tableName, id),
        updateState: () =>
          updateCache((prevItems) =>
            prevItems.filter((item) => item.id !== id)
          ),
      };
    }),
    clear: withHandleStateUpdate(async () => {
      return {
        result: await clear(tableName),
        updateState: () => updateCache([]),
      };
    }),
    bulkAdd: withHandleStateUpdate(async (items) => {
      const keys = await bulkAdd(tableName, items, { allKeys: true });
      const newItems = await bulkGet(tableName, keys);

      return {
        result: newItems,
        updateState: () =>
          updateCache((prevItems) => [...prevItems, ...newItems]),
      };
    }),
    set: withHandleStateUpdate(async (items) => {
      await clear(tableName);
      const keys = await bulkAdd(tableName, items, { allKeys: true });
      const newItems = await bulkGet(tableName, keys);
      return { result: newItems, updateState: () => updateCache(newItems) };
    }),
  };
};
