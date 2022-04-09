import { TextField } from "@mui/material";
import { useReadData, useWriteData } from "hooks";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { isEnterKey, shuffle } from "utils";
import {
  accountMock,
  categoryMock,
  transactionMock,
} from "../test-utils/mocks/entities";

const MOCK_SEED_COMMAND = "seed";
const CLEAR_COMMAND = "clear";

const mockAccountNames = [
  "Cash",
  "Bank Account BChile",
  "Credit Card Nat BChile",
  "Credit Card Int BChile",
  "Bank Account Santander",
  "Bank Account BEstado",
  "Savings Account BEstado",
  "My Debts",
  "Their Debts",
  "Depositos a Plazo",
  "Silicon Fund",
  "Risky Norris",
  "Portafolio Activo Agresivo BChile",
];

const mockCategoryNames = [
  "Expenses",
  "Going Out",
  "Vacations",
  "Snacks & Food",
  "Other",
  "Education",
  "Health",
  "Apparel",
  "Gifts",
];

const mockIncomeCategoryNames = [
  "Salary",
  "Gift",
  "Allowance",
  "Investment",
  "Other",
];

const noId = ({ id, ...rest }) => rest;

const useCommands = () => {
  const { set: setAccounts, clear: clearAccounts } = useWriteData("accounts");
  const {
    set: setIncomeCategories,
    clear: clearIncomeCategories,
  } = useWriteData("incomeCategories");
  const {
    set: setExpenseCategories,
    clear: clearExpenseCategories,
  } = useWriteData("categories");
  const { set: setTransactions, clear: clearTransactions } = useWriteData(
    "transactions"
  );

  const { refetch: refetchAccounts } = useReadData("accounts");
  const { refetch: refetchIncomeCategories } = useReadData("incomeCategories");
  const { refetch: refetchExpenseCategories } = useReadData("categories");
  const { refetch: refetchTransactions } = useReadData("transactions");

  const populate = async (number) => {
    // Create accounts
    const accounts = await setAccounts(
      shuffle(mockAccountNames)
        .map((name, idx) =>
          accountMock({
            name,
            closedAt: idx % 4 ? DateTime.local().toSeconds() : null,
          })
        )
        .map((item) => noId(item))
    );

    refetchAccounts();

    // Create income cats
    const incomeCategories = await setIncomeCategories(
      shuffle(mockIncomeCategoryNames)
        .map((name, idx) =>
          categoryMock({
            name,
            closedAt: idx % 4 ? DateTime.local().toSeconds() : null,
          })
        )
        .map((item) => noId(item))
    );

    refetchIncomeCategories();

    // Create expense cats
    const expenseCategories = await setExpenseCategories(
      shuffle(mockCategoryNames)
        .map((name, idx) =>
          categoryMock({
            name,
            closedAt: idx % 4 ? DateTime.local().toSeconds() : null,
          })
        )
        .map((item) => noId(item))
    );

    refetchExpenseCategories();

    // Create transactions
    let runningDate = DateTime.local();
    await setTransactions(
      [...Array(number)].map(transactionMock).map((item, idx) => {
        runningDate = runningDate.minus({ hours: 3 + (idx % 15) });
        const accountsLength = accounts.length;

        return noId({
          ...item,
          date: runningDate.toSeconds(),
          accountId: accounts[(idx + 1) % accountsLength].id,
          originAccountId: accounts[(idx * 2 + 2) % accountsLength].id,
          destinationAccountId: accounts[(idx * 3 + 3) % accountsLength].id,
          categoryId:
            (item.type === "income" &&
              incomeCategories[idx % incomeCategories.length].id) ||
            (item.type === "expense" &&
              expenseCategories[idx % expenseCategories.length].id) ||
            null,
        });
      })
    );

    refetchTransactions();
  };

  const clear = async () => {
    await clearTransactions();
    refetchTransactions();
    await clearAccounts();
    refetchAccounts();
    await clearIncomeCategories();
    refetchIncomeCategories();
    await clearExpenseCategories();
    refetchExpenseCategories();
  };

  return { populate, clear };
};

const Commands = () => {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { populate, clear } = useCommands();

  const submit = async () => {
    setDisabled(true);
    if (value.slice(0, 4) === MOCK_SEED_COMMAND) {
      const number = parseInt(value.slice(4), 10);
      await populate(number);
    }
    if (value === CLEAR_COMMAND) {
      await clear();
    }
    setDisabled(false);
    setValue("");
  };

  return (
    <TextField
      value={value}
      onChange={(ev) => setValue(ev.target.value)}
      label="Command line"
      onKeyPress={(ev) => {
        if (isEnterKey(ev)) {
          submit();
        }
      }}
      disabled={disabled}
      id="command-input"
    />
  );
};

export default Commands;
