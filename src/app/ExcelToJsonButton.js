import React from "react";
import { Button } from "@mui/material";
import { read, utils } from "xlsx";
import { DateTime } from "luxon";
import { download } from "utils";

// TODO: refactor this huge file

const handleData = (data) => {
  const transactions = [];

  data.forEach((row) => {
    const type =
      (row["Income/Expense"] === "Transfer-Out" && "transfer") ||
      (row["Income/Expense"] === "Expense" && "expense") ||
      (row["Income/Expense"] === "Income" && "income");

    if (!type) {
      throw new Error(`Unkonwn type: ${row["Income/Expense"]}`);
    }

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
  });

  download("scash_data", JSON.stringify({ transactions }));
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
