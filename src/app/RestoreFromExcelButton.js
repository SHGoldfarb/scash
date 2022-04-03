import React from "react";
import { Button } from "@mui/material";
import { read, utils } from "xlsx";
import { DateTime } from "luxon";
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
    const type =
      (row["Income/Expense"] === "Transfer-Out" && "transfer") ||
      (row["Income/Expense"] === "Expense" && "expense") ||
      (row["Income/Expense"] === "Income" && "income");

    // Create accounts
    if (!accountsHash[row.Account]) {
      await addAccount(row.Account);
    }

    if (type === "transfer" && !accountsHash[row.Category]) {
      await addAccount(row.Category);
    }

    // Create categories
    let categoryName = row.Category;
    if (row.Subcategory) {
      categoryName = `${row.Category}: ${row.Subcategory}`;
    }

    if (type === "expense" && !categoriesHash[categoryName]) {
      await addCategory(categoryName);
    }

    if (type === "income" && !incomeCategoriesHash[categoryName]) {
      await addIncomeCategory(categoryName);
    }

    // Create transaction

    const dateTime = DateTime.fromSeconds(
      // In hours
      (row.Date * 24 -
        // Minus 70 years
        70 * 365 * 24 -
        // Minus 18 days
        18 * 24 -
        // Minus 21 hours
        21) *
        // In seconds
        60 *
        60
    );

    const transaction = {
      amount: row.Amount,
      comment: row.Note || "",
      date: dateTime.toSeconds(),
      type,
      accountId: type !== "transfer" && accountsHash[row.Account].id,
      originAccountId: type === "transfer" && accountsHash[row.Account].id,
      destinationAccountId:
        type === "transfer" && accountsHash[row.Category].id,
      categoryId:
        (type === "income" && incomeCategoriesHash[categoryName].id) ||
        (type === "expense" && categoriesHash[categoryName].id) ||
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
    reader.readAsArrayBuffer(file);
  });

const handleFileSelect = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    // eslint-disable-next-line no-console
    console.warn("No file selected?");
    return;
  }

  const data = read(await readFile(file));

  const sheet1 = data.Sheets[data.SheetNames[0]];

  const jsonData = utils.sheet_to_json(sheet1);

  const [handleRow, commitTransactions] = await makeRowsHandler();

  await asyncReduce(jsonData.map((row) => () => handleRow(row)));

  await commitTransactions();
};

const RestoreFromExcelButton = () => {
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
      Upload Excel File
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

export default RestoreFromExcelButton;
