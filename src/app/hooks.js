import { useReadData } from "hooks";

export const useTransactionsForList = () =>
  useReadData("transactions", {
    belongsTo: {
      account: { through: "accountId", source: "accounts" },
      originAccount: { through: "originAccountId", source: "accounts" },
      destinationAccount: {
        through: "destinationAccountId",
        source: "accounts",
      },
    },
  });
