import { useLocation } from "react-router-dom";
import { useData } from "src/hooks";
import { parseSearchParams } from "src/utils";

const useCurrentObjective = () => {
  const location = useLocation();

  const { id } = parseSearchParams(location.search);

  const result = useData("objectives");

  const intId = id ? parseInt(id, 10) : null;

  const objective = (result.dataHash || {})[intId];

  const update = (newData) => result.upsert({ ...objective, ...newData });

  return { ...result, objective, update };
};

export default useCurrentObjective;
