import { TextField } from "@material-ui/core";
import { useReadData, useWriteData } from "hooks";
import { DateTime } from "luxon";
import React, { useState } from "react";
import { isActive, isEnterKey } from "utils";
import {
  accountMock,
  categoryMock,
  transactionMock,
} from "../test-utils/mocks/entities";

const MOCK_SEED_COMMAND = "seed";
const CLEAR_COMMAND = "clear";

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
      [...Array(20)].map(accountMock).map((item, idx) =>
        noId({
          ...item,
          deactivatedAt: idx % 4 ? DateTime.local().toSeconds() : null,
        })
      )
    );

    refetchAccounts();

    // Create income cats
    await setIncomeCategories(
      [...Array(20)].map(categoryMock).map((item, idx) =>
        noId({
          ...item,
          deactivatedAt: idx % 4 ? DateTime.local().toSeconds() : null,
        })
      )
    );

    refetchIncomeCategories();

    // Create expense cats
    await setExpenseCategories(
      [...Array(20)].map(categoryMock).map((item, idx) =>
        noId({
          ...item,
          deactivatedAt: idx % 4 ? DateTime.local().toSeconds() : null,
        })
      )
    );

    refetchExpenseCategories();

    const activeAccounts = accounts.filter(isActive);

    // Create transactions
    let runningDate = DateTime.local();
    await setTransactions(
      [...Array(number)].map(transactionMock).map((item, idx) => {
        runningDate = runningDate.minus({ hours: 3 + (idx % 15) });
        const activeAccountsLength = activeAccounts.length;
        return noId({
          ...item,
          date: runningDate.toSeconds(),
          accountId: activeAccounts[(idx + 1) % activeAccountsLength].id,
          originAccountId:
            activeAccounts[(idx * 2 + 2) % activeAccountsLength].id,
          destinationAccountId:
            activeAccounts[(idx * 3 + 3) % activeAccountsLength].id,
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
