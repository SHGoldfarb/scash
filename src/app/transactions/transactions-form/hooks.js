import { useReadData } from "hooks";
import { isActive } from "utils";

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

  return { activeAccounts, ...result };
};
