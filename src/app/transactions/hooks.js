import { useMemo } from "react";
import { useLocation, useHistory } from "react-router-dom";
import { useReadData } from "hooks";
import { DateTime } from "luxon";
import { makePath, transactionsPathName, parseSearchParams } from "utils";

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

export const useSelectedMonth = () => {
  const location = useLocation();
  const history = useHistory();
  const { month, year } = parseSearchParams(location.search);

  const selectedMonth =
    month && year ? DateTime.fromObject({ month, year }) : DateTime.local();

  const setSelectedMonth = (date) =>
    history.push(
      makePath(transactionsPathName, {
        params: {
          month: date.month,
          year: date.year,
        },
      })
    );

  return [selectedMonth, setSelectedMonth];
};
