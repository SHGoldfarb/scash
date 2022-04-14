import { useReadData } from "hooks";
import { isOpen, isClosed } from "utils";
import { useCurrentTransaction } from "../hooks";

export const useFormIncomeSources = () => {
  const result = useReadData("incomeSources");

  const { transaction, loading: transactionLoading } = useCurrentTransaction();

  const availableIncomeSources = (result.data || []).filter(
    (incomeSource) =>
      !incomeSource.closedAt || incomeSource.id === transaction?.incomeSourceId
  );

  return {
    availableIncomeSources,
    ...result,
    loading: result.loading || transactionLoading,
  };
};

export const useFormObjectives = () => {
  const result = useReadData("objectives");

  const { transaction, loading: transactionLoading } = useCurrentTransaction();

  const availableObjectives = (result.data || []).filter(
    (objective) =>
      !objective.closedAt || objective.id === transaction?.objectiveId
  );

  return {
    availableObjectives,
    ...result,
    loading: result.loading || transactionLoading,
  };
};

export const useFormAccounts = () => {
  const result = useReadData("accounts");

  const openAccounts = (result.data || []).filter(isOpen);
  const closedAccounts = (result.data || []).filter(isClosed);

  return { openAccounts, closedAccounts, ...result };
};
