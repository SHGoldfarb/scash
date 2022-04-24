import { useHistory } from "react-router-dom";
import { parseSearchParams, stringifySearchParams } from "utils";

export * from "./useData";
export * from "./useGlobalMemo";

export const useUrlParams = () => {
  const history = useHistory();

  const params = parseSearchParams(history.location.search);

  return {
    params,
    push: (newParams) =>
      history.push(
        `${history.location.pathname}?${stringifySearchParams({
          ...params,
          ...newParams,
        })}`
      ),
    replace: (newParams) =>
      history.replace(
        `${history.location.pathname}?${stringifySearchParams({
          ...params,
          ...newParams,
        })}`
      ),
  };
};
