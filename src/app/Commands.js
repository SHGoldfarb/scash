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
import { useTransactionsForList } from "./hooks";

const MOCK_SEED_COMMAND = "seed5000";

const noId = ({ id, ...rest }) => rest;

const useCommands = () => {
  const { set: setAccounts } = useWriteData("accounts");
  const { set: setIncomeCategories } = useWriteData("incomeCategories");
  const { set: setExpenseCategories } = useWriteData("categories");
  const { set: setTransactions } = useWriteData("transactions");

  const { refetch: refetchAccounts } = useReadData("accounts");
  const { refetch: refetchIncomeCategories } = useReadData("incomeCategories");
  const { refetch: refetchExpenseCategories } = useReadData("categories");
  const { refetch: refetchTransactions } = useTransactionsForList();

  const populate = async () => {
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
      [...Array(5000)].map(transactionMock).map((item, idx) => {
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

  return { populate };
};

const Commands = () => {
  const [value, setValue] = useState("");
  const [disabled, setDisabled] = useState(false);

  const { populate } = useCommands();

  const submit = async () => {
    if (value === MOCK_SEED_COMMAND) {
      setDisabled(true);
      await populate();
      setDisabled(false);
      setValue("");
    }
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
