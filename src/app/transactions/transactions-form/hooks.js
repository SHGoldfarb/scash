import { useReadData } from "hooks";
import { isOpen, isClosed } from "utils";
import { useCurrentTransaction } from "../hooks";

export const useFormCategories = (transactionType) => {
  const categoriesTable =
    transactionType === "expense" ? "categories" : "incomeCategories";

  const result = useReadData(categoriesTable);

  const { transaction, loading: transactionLoading } = useCurrentTransaction();

  const availableCategories = (result.data || []).filter(
    (category) => !category.closedAt || category.id === transaction?.categoryId
  );

  return {
    availableCategories,
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
