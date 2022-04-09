import { useReadData } from "hooks";
import { isOpen, isClosed } from "utils";

export const useFormCategories = (transactionType) => {
  const categoriesTable =
    transactionType === "expense" ? "categories" : "incomeCategories";

  const result = useReadData(categoriesTable);

  const activeCategories = (result.data || []).filter(isOpen);

  return { activeCategories, ...result };
};

export const useFormAccounts = () => {
  const result = useReadData("accounts");

  const activeAccounts = (result.data || []).filter(isOpen);
  const inactiveAccounts = (result.data || []).filter(isClosed);

  return { activeAccounts, inactiveAccounts, ...result };
};
