import { useMemo } from "react";
import { upsertById } from "src/utils";
import { isFunction } from "src/lib";
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

const dataByIds = (data) => {
  const hash = {};
  data.forEach((item) => {
    hash[item.id] = item;
  });

  return hash;
};

const withByIdsHash = (data) => ({ data, byIds: dataByIds(data) });

export const useData = (tableName) => {
  const {
    result: { data: memoizedData, byIds: memoizedByIds } = {},
    loading,
    update: updateCache,
    reset: clearCache,
  } = useGlobalMemo(tableName, async () =>
    withByIdsHash(await getAll(tableName))
  );

  const updateDataCache = (updateFunction) => {
    if (isFunction(updateFunction)) {
      return updateCache(({ data } = {}) => {
        return withByIdsHash(updateFunction(data));
      });
    }
    return updateCache(withByIdsHash(updateFunction));
  };

  const data = useMemo(() => memoizedData || [], [memoizedData]);
  const byIds = useMemo(() => memoizedByIds || {}, [memoizedByIds]);

  return {
    data,
    dataHash: byIds,
    loading: loading || !memoizedData,
    refetch: clearCache,
    upsert: withHandleStateUpdate(async (newData) => {
      const newId = await upsert(tableName, newData);
      const newItem = await getById(tableName, newId);

      return {
        result: newItem,
        updateState: () =>
          updateDataCache((prevItems) => upsertById(prevItems, newItem)),
      };
    }),
    remove: withHandleStateUpdate(async (id) => {
      return {
        result: await remove(tableName, id),
        updateState: () =>
          updateDataCache((prevItems) =>
            prevItems.filter((item) => item.id !== id)
          ),
      };
    }),
    clear: withHandleStateUpdate(async () => {
      return {
        result: await clear(tableName),
        updateState: () => updateDataCache([]),
      };
    }),
    bulkAdd: withHandleStateUpdate(async (items) => {
      const keys = await bulkAdd(tableName, items, { allKeys: true });
      const newItems = await bulkGet(tableName, keys);

      return {
        result: newItems,
        updateState: () =>
          updateDataCache((prevItems) => [...prevItems, ...newItems]),
      };
    }),
    set: withHandleStateUpdate(async (items) => {
      await clear(tableName);
      const keys = await bulkAdd(tableName, items, { allKeys: true });
      const newItems = await bulkGet(tableName, keys);
      return { result: newItems, updateState: () => updateDataCache(newItems) };
    }),
  };
};
