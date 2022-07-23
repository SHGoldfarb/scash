import { useData } from "src/hooks";
import { useMemo } from "react";
import { isOpen, isClosed, by } from "src/utils";
import { useCurrentTransaction } from "../hooks";

export const useFormIncomeSources = () => {
  const result = useData("incomeSources");

  const { transaction, loading: transactionLoading } = useCurrentTransaction();

  const sortedIncomeSources = useMemo(
    () => (result.data || []).sort(by("name")),
    [result.data]
  );

  const availableIncomeSources = sortedIncomeSources.filter(
    (incomeSource) =>
      !incomeSource.closedAt || incomeSource.id === transaction?.incomeSourceId
  );

  return {
    availableIncomeSources,
    ...result,
    loading: result.loading || transactionLoading,
    data: sortedIncomeSources,
  };
};

export const useFormObjectives = () => {
  const result = useData("objectives");

  const sortedObjectives = useMemo(() => (result.data || []).sort(by("name")), [
    result.data,
  ]);

  const { transaction, loading: transactionLoading } = useCurrentTransaction();

  const availableObjectives = sortedObjectives.filter(
    (objective) =>
      !objective.closedAt || objective.id === transaction?.objectiveId
  );

  return {
    availableObjectives,
    ...result,
    loading: result.loading || transactionLoading,
    data: sortedObjectives,
  };
};

export const useFormAccounts = () => {
  const result = useData("accounts");

  const sortedAccounts = useMemo(() => (result.data || []).sort(by("name")), [
    result.data,
  ]);

  const openAccounts = sortedAccounts.filter(isOpen);
  const closedAccounts = sortedAccounts.filter(isClosed);

  return { openAccounts, closedAccounts, ...result, data: sortedAccounts };
};
