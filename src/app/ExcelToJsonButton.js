// TODO: refactor this huge file

import React from "react";
import { Button } from "@mui/material";
import { read, utils } from "xlsx";
import { DateTime } from "luxon";
import { download, newId } from "utils";

const handleData = (data) => {
  const transactions = [];
  const accounts = {};
  const incomeCategories = {};
  const categories = {};

  data.forEach((row) => {
    const type =
      (row["Income/Expense"] === "Transfer-Out" && "transfer") ||
      (row["Income/Expense"] === "Expense" && "expense") ||
      (row["Income/Expense"] === "Income" && "income");

    if (!type) {
      throw new Error(`Unkonwn type: ${row["Income/Expense"]}`);
    }

    const isTransfer = type === "transfer";
    const isExpense = type === "expense";
    const isIncome = type === "income";

    let categoryName = row.Category;
    if (row.Subcategory) {
      categoryName = `${row.Category}: ${row.Subcategory}`;
    }

    accounts[row.Account] = accounts[row.Account] || {
      name: row.Account,
      id: newId(),
    };
    if (isTransfer) {
      accounts[row.Category] = accounts[row.Category] || {
        name: row.Category,
        id: newId(),
      };
    } else if (isExpense) {
      categories[categoryName] = categories[categoryName] || {
        name: categoryName,
        id: newId(),
      };
    } else if (isIncome) {
      incomeCategories[categoryName] = incomeCategories[categoryName] || {
        name: categoryName,
        id: newId(),
      };
    }

    // Create JSON item

    const account = isTransfer ? null : accounts[row.Account];
    const originAccount = isTransfer ? accounts[row.Account] : null;
    const destinationAccount = isTransfer ? accounts[row.Category] : null;
    const category =
      (isExpense && categories[categoryName]) ||
      (isIncome && incomeCategories[categoryName]) ||
      null;

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
      accountId: account?.id,
      originAccountId: originAccount?.id,
      destinationAccountId: destinationAccount?.id,
      categoryId: category?.id,
    };

    transactions.push(transaction);
  });

  download(
    "scash_converted_data",
    JSON.stringify({
      transactions,
      accounts: Object.values(accounts),
      categories: Object.values(categories),
      incomeCategories: Object.values(incomeCategories),
    })
  );
};

const readAsArrayBuffer = (file) =>
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

  const data = read(await readAsArrayBuffer(file));

  const sheet1 = data.Sheets[data.SheetNames[0]];

  const jsonData = utils.sheet_to_json(sheet1);

  handleData(jsonData);
};

const ExcelToJsonButton = () => {
  return (
    <Button component="label">
      Excel to JSON
      <input
        type="file"
        hidden
        onChange={async (ev) => {
          await handleFileSelect(ev);
        }}
      />
    </Button>
  );
};

export default ExcelToJsonButton;
