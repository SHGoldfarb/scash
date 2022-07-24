import { utils } from "xlsx";
import { DateTime } from "luxon";
import { asyncReduce } from "../lib";
import { newId } from "./utils";
import { clear, getAll, upsert, bulkAdd } from "../database";

export const exportToJSON = async () =>
  JSON.stringify({
    transactions: await getAll("transactions"),
    accounts: await getAll("accounts"),
    objectives: await getAll("objectives"),
    incomeSources: await getAll("incomeSources"),
  });

export const importFromJSON = async (jsonData) => {
  await clear("accounts");
  await clear("objectives");
  await clear("incomeSources");
  await clear("transactions");

  const { accounts, objectives, incomeSources, transactions } = JSON.parse(
    jsonData
  );

  const accountsHash = {};
  const objectivesHash = {};
  const incomeSourcesHash = {};

  await asyncReduce(
    accounts.map((account) => async () => {
      accountsHash[account.id] = await upsert("accounts", {
        ...account,
        id: undefined,
      });
    })
  );

  await asyncReduce(
    objectives.map((objective) => async () => {
      objectivesHash[objective.id] = await upsert("objectives", {
        ...objective,
        id: undefined,
      });
    })
  );

  await asyncReduce(
    incomeSources.map((incomeSource) => async () => {
      incomeSourcesHash[incomeSource.id] = await upsert("incomeSources", {
        ...incomeSource,
        id: undefined,
      });
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
      objectiveId: objectivesHash[transaction.objectiveId],
      incomeSourceId: incomeSourcesHash[transaction.incomeSourceId],
    }))
  );
};

export const excelDaysToLuxonSeconds = (days) =>
  // In hours
  (days * 24 -
    // Minus 70 years
    70 * 365 * 24 -
    // Minus 18 days
    18 * 24 -
    // Minus 21 hours
    21) *
  // In seconds
  60 *
  60;

export const luxonSecondsToExcelDays = (seconds) =>
  (seconds / 60.0 / 60 + 21 + 18 * 24 + 70 * 365 * 24) / 24;

export const excelToJson = (workbook) => {
  const sheet1 = workbook.Sheets[workbook.SheetNames[0]];

  const jsonData = utils.sheet_to_json(sheet1);

  const transactions = [];
  const accounts = {};
  const incomeSources = {};
  const objectives = {};

  jsonData.forEach((row) => {
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
      objectives[categoryName] = objectives[categoryName] || {
        name: categoryName,
        id: newId(),
      };
    } else if (isIncome) {
      incomeSources[categoryName] = incomeSources[categoryName] || {
        name: categoryName,
        id: newId(),
      };
    }

    // Create JSON item

    const account = isTransfer ? null : accounts[row.Account];
    const originAccount = isTransfer ? accounts[row.Account] : null;
    const destinationAccount = isTransfer ? accounts[row.Category] : null;
    const objective = objectives[categoryName];
    const incomeSource = incomeSources[categoryName];

    const dateTime = DateTime.fromSeconds(excelDaysToLuxonSeconds(row.Date));

    const transaction = {
      amount: row.Amount,
      comment: row.Note || row.Subcategory || categoryName || "",
      date: dateTime.toSeconds(),
      type,
      accountId: account?.id,
      originAccountId: originAccount?.id,
      destinationAccountId: destinationAccount?.id,
      objectiveId: objective?.id,
      incomeSourceId: incomeSource?.id,
    };

    transactions.push(transaction);
  });

  return JSON.stringify({
    transactions,
    accounts: Object.values(accounts),
    objectives: Object.values(objectives),
    incomeSources: Object.values(incomeSources),
  });
};
