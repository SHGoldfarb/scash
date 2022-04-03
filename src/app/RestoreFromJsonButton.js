import React from "react";
import { Button } from "@mui/material";
import { asyncReduce } from "utils";
import { useReadData, useWriteData } from "hooks";
import { upsert, bulkAdd } from "../database";

// TODO: refactor this huge file

const makeImportHandlers = () => {
  const accountsHash = {};
  const categoriesHash = {};
  const incomeCategoriesHash = {};

  const handleAccounts = (accounts) =>
    asyncReduce(
      accounts.map((account) => async () => {
        accountsHash[account.id] = await upsert("accounts", {
          ...account,
          id: undefined,
        });
      })
    );

  const handleCategories = (categories) =>
    asyncReduce(
      categories.map((category) => async () => {
        categoriesHash[category.id] = await upsert("categories", {
          ...category,
          id: undefined,
        });
      })
    );

  const handleIncomeCategories = (incomeCategories) =>
    asyncReduce(
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

  const handleTransactions = (transactions) => {
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

  return {
    handleAccounts,
    handleCategories,
    handleIncomeCategories,
    handleTransactions,
  };
};

const readFile = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsText(file);
  });

const handleFileSelect = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    // eslint-disable-next-line no-console
    console.warn("No file selected?");
    return;
  }

  const data = JSON.parse(await readFile(file));

  const {
    handleAccounts,
    handleCategories,
    handleIncomeCategories,
    handleTransactions,
  } = makeImportHandlers();

  await handleAccounts(data.accounts);
  await handleCategories(data.categories);
  await handleIncomeCategories(data.incomeCategories);
  await handleTransactions(data.transactions);
};

const RestoreFromJsonButton = () => {
  const { clear: clearAccounts } = useWriteData("accounts");
  const { clear: clearCategories } = useWriteData("categories");
  const { clear: clearIncomeCategories } = useWriteData("categories");
  const { clear: clearTransactions } = useWriteData("transactions");

  const { refetch: refetchAccounts } = useReadData("accounts");
  const { refetch: refetchCategories } = useReadData("categories");
  const { refetch: refetchIncomeCategories } = useReadData("categories");
  const { refetch: refetchTransactions } = useReadData("transactions");
  return (
    <Button component="label">
      Upload JSON File
      <input
        type="file"
        hidden
        onChange={async (ev) => {
          await clearAccounts();
          await clearCategories();
          await clearIncomeCategories();
          await clearTransactions();

          await handleFileSelect(ev);

          refetchAccounts();
          refetchCategories();
          refetchIncomeCategories();
          refetchTransactions();
        }}
      />
    </Button>
  );
};

export default RestoreFromJsonButton;
