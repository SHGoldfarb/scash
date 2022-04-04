import { asyncReduce } from "./utils";
import { getAll, upsert, bulkAdd } from "../database";

export const databaseDataToJson = async () =>
  JSON.stringify({
    transactions: await getAll("transactions"),
    accounts: await getAll("accounts"),
    categories: await getAll("categories"),
    incomeCategories: await getAll("incomeCategories"),
  });

export const importJSON = async (jsonData) => {
  const { accounts, categories, incomeCategories, transactions } = JSON.parse(
    jsonData
  );

  const accountsHash = {};
  const categoriesHash = {};
  const incomeCategoriesHash = {};

  await asyncReduce(
    accounts.map((account) => async () => {
      accountsHash[account.id] = await upsert("accounts", {
        ...account,
        id: undefined,
      });
    })
  );

  await asyncReduce(
    categories.map((category) => async () => {
      categoriesHash[category.id] = await upsert("categories", {
        ...category,
        id: undefined,
      });
    })
  );

  await asyncReduce(
    incomeCategories.map((incomeCategory) => async () => {
      incomeCategoriesHash[incomeCategory.id] = await upsert(
        "incomeCategories",
        {
          ...incomeCategory,
          id: undefined,
        }
      );
    })
  );

  return bulkAdd(
    "transactions",
    transactions.map((transaction) => ({
      ...transaction,
      id: undefined,
      accountId: accountsHash[transaction.accountId],
      originAccountId: accountsHash[transaction.originAccountId],
      destinationAccountId: accountsHash[transaction.destinationAccountId],
      categoryId:
        transaction.type === "income"
          ? incomeCategoriesHash[transaction.categoryId]
          : categoriesHash[transaction.categoryId],
    }))
  );
};
