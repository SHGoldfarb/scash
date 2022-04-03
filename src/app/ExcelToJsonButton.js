import React from "react";
import { Button } from "@mui/material";
import { read, utils } from "xlsx";
import { DateTime } from "luxon";

// TODO: refactor this huge file

// https://stackoverflow.com/a/18197341
const download = (filename, text) => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:text/plain;charset=utf-8,${encodeURIComponent(text)}`
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
};

const makeRowsHandler = () => {
  const transactions = [];

  const handleRow = (row) => {
    const type =
      (row["Income/Expense"] === "Transfer-Out" && "transfer") ||
      (row["Income/Expense"] === "Expense" && "expense") ||
      (row["Income/Expense"] === "Income" && "income");

    // Create JSON item

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

    let categoryName = row.Category;
    if (row.Subcategory) {
      categoryName = `${row.Category}: ${row.Subcategory}`;
    }

    const transaction = {
      amount: row.Amount,
      comment: row.Note || "",
      date: dateTime.toSeconds(),
      type,
      account: (type !== "transfer" && row.Account) || null,
      originAccount: (type === "transfer" && row.Account) || null,
      destinationAccount: (type === "transfer" && row.Category) || null,
      category: (type !== "transfer" && categoryName) || null,
    };

    transactions.push(transaction);
  };

  const commitTransactions = () => {
    download("scash_data", JSON.stringify(transactions));
  };

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

  const [handleRow, commitTransactions] = makeRowsHandler();

  jsonData.forEach((row) => handleRow(row));

  commitTransactions();
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
