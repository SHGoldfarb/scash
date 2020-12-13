import { makeStyles, Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { currencyFormat, getTransactionsStats, upsertById } from "../utils";
import { useTransactionsForList } from "./hooks";

const useStyles = makeStyles((theme) => ({
  positive: {
    color: theme.palette.success.light,
  },
  negative: {
    color: theme.palette.error.light,
  },
}));

const Accounts = () => {
  const { loading, data: accounts = [], update } = useReadData("accounts");
  const { upsert } = useWriteData("accounts");
  const {
    data: transactions = [],
    loading: transactionsLoading,
  } = useTransactionsForList();

  const deleteAccount = async (accountToDelete) => {
    const returnedAccount = await upsert({
      ...accountToDelete,
      deactivatedAt: DateTime.local().toSeconds(),
    });
    update((currentAccounts) => upsertById(currentAccounts, returnedAccount));
  };

  const upsertAccount = async (newAccount) => {
    const returnedAccount = await upsert(newAccount);
    update((currentAccounts) => upsertById(currentAccounts, returnedAccount));
  };

  const activeAccounts = accounts.filter((account) => !account.deactivatedAt);

  const { accountAmounts } = useMemo(() => getTransactionsStats(transactions), [
    transactions,
  ]);

  const classes = useStyles();

  return (
    <>
      <Typography variant="h5" color="textPrimary">
        Accounts
      </Typography>

      {loading || transactionsLoading ? (
        "Cargando..."
      ) : (
        <EditableList
          source={activeAccounts.map((account) => ({
            ...account,
            label: account.name,
            sublabel: (
              <span
                className={
                  (accountAmounts[account.id] || 0) < 0
                    ? classes.negative
                    : classes.positive
                }
              >
                {currencyFormat(accountAmounts[account.id] || 0)}
              </span>
            ),
          }))}
          onUpdate={(account) =>
            upsertAccount({ id: account.id, name: account.label })
          }
          onAdd={(account) => upsertAccount({ name: account.label })}
          onRemove={deleteAccount}
        />
      )}
    </>
  );
};

export default Accounts;
