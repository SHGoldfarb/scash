import { useMemo } from "react";
import { useLocation } from "react-router-dom";
import { parseSearchParams } from "utils";
import { useReadData } from "hooks";

export const useCurrentTransaction = () => {
  const location = useLocation();

  const { id } = parseSearchParams(location.search);

  const { loading, data: transactions = [] } = useReadData("transactions");

  const intId = id ? parseInt(id, 10) : null;

  const transaction = useMemo(
    () => transactions.find(({ id: tid }) => tid === intId),
    [intId, transactions]
  );

  if (!id) return {};

  return { loading, transaction };
};
