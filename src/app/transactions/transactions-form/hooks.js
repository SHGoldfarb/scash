import { useReadData } from "hooks";
import { isOpen, isClosed } from "utils";

export const useFormCategories = (transactionType) => {
  const categoriesTable =
    transactionType === "expense" ? "categories" : "incomeCategories";

  const result = useReadData(categoriesTable);

  const openCategories = (result.data || []).filter(isOpen);

  return { openCategories, ...result };
};

export const useFormAccounts = () => {
  const result = useReadData("accounts");

  const openAccounts = (result.data || []).filter(isOpen);
  const closedAccounts = (result.data || []).filter(isClosed);

  return { openAccounts, closedAccounts, ...result };
};
