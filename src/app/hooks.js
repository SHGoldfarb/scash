import { useReadData } from "hooks";

export const useTransactionsForList = () =>
  useReadData("transactions", {
    belongsTo: {
      account: { through: "accountId", source: "accounts" },
    },
  });
