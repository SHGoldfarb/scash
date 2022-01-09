import { useReadData } from "hooks";
import { isActive, isInactive } from "utils";

export const useFormCategories = (transactionType) => {
  const categoriesTable =
    transactionType === "expense" ? "categories" : "incomeCategories";

  const result = useReadData(categoriesTable);

  const activeCategories = (result.data || []).filter(isActive);

  return { activeCategories, ...result };
};

export const useFormAccounts = () => {
  const result = useReadData("accounts");

  const activeAccounts = (result.data || []).filter(isActive);
  const inactiveAccounts = (result.data || []).filter(isInactive);

  return { activeAccounts, inactiveAccounts, ...result };
};
