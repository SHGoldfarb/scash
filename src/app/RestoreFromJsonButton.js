import React from "react";
import { Button } from "@mui/material";
import { asyncReduce } from "utils";
import { useReadData, useWriteData } from "hooks";
import { getAll, upsert, bulkAdd } from "../database";

// TODO: refactor this huge file

const getAccountsHash = async () => {
  const accounts = await getAll("accounts");

  const hash = {};
  accounts.forEach((account) => {
    if (hash[account.name]) {
      throw new Error(
        `There are two or more accounts with name ${account.name}`
      );
    }
    hash[account.name] = account;
  });

  return hash;
};

const getCategoriesHash = async () => {
  const categories = await getAll("categories");

  const hash = {};
  categories.forEach((category) => {
    if (hash[category.name]) {
      throw new Error(
        `There are two or more categories with name ${category.name}`
      );
    }
    hash[category.name] = category;
  });

  return hash;
};

const getIncomeCategoriesHash = async () => {
  const incomeCategories = await getAll("incomeCategories");

  const hash = {};
  incomeCategories.forEach((incomeCategory) => {
    if (hash[incomeCategory.name]) {
      throw new Error(
        `There are two or more income categories with name ${incomeCategory.name}`
      );
    }
    hash[incomeCategory.name] = incomeCategory;
  });

  return hash;
};

const makeRowsHandler = async () => {
  let accountsHash = await getAccountsHash();

  const addAccount = async (name) => {
    await upsert("accounts", { name });
    accountsHash = await getAccountsHash();
  };

  let categoriesHash = await getCategoriesHash();

  const addCategory = async (name) => {
    await upsert("categories", { name });
    categoriesHash = await getCategoriesHash();
  };

  let incomeCategoriesHash = await getIncomeCategoriesHash();

  const addIncomeCategory = async (name) => {
    await upsert("incomeCategories", { name });
    incomeCategoriesHash = await getIncomeCategoriesHash();
  };

  const transactions = [];

  const handleRow = async (row) => {
    // Create accounts
    if (row.type !== "transfer" && !accountsHash[row.account]) {
      await addAccount(row.account);
    }

    if (row.type === "transfer") {
      if (!accountsHash[row.originAccount]) {
        await addAccount(row.originAccount);
      }

      if (!accountsHash[row.destinationAccount]) {
        await addAccount(row.destinationAccount);
      }
    }

    if (row.type === "expense" && !categoriesHash[row.category]) {
      await addCategory(row.category);
    }

    if (row.type === "income" && !incomeCategoriesHash[row.category]) {
      await addIncomeCategory(row.category);
    }

    // Create transaction

    const transaction = {
      amount: row.amount,
      comment: row.comment || "",
      date: row.date,
      type: row.type,
      accountId:
        (row.type !== "transfer" && accountsHash[row.account].id) || null,
      originAccountId:
        (row.type === "transfer" && accountsHash[row.originAccount].id) || null,
      destinationAccountId:
        (row.type === "transfer" && accountsHash[row.destinationAccount].id) ||
        null,
      categoryId:
        (row.type === "income" && incomeCategoriesHash[row.category].id) ||
        (row.type === "expense" && categoriesHash[row.category].id) ||
        null,
    };

    transactions.push(transaction);
  };

  const commitTransactions = () => bulkAdd("transactions", transactions);

  return [handleRow, commitTransactions];
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

  const [handleRow, commitTransactions] = await makeRowsHandler();

  await asyncReduce(data.transactions.map((row) => () => handleRow(row)));

  await commitTransactions();
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
