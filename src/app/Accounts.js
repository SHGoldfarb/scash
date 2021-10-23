import { makeStyles, Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { DelayedCircularProgress, EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { currencyFormat, getTransactionsStats, upsertById } from "../utils";

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
  const { data: transactions = [], loading: transactionsLoading } = useReadData(
    "transactions"
  );

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
        <DelayedCircularProgress />
      ) : (
        <EditableList
          source={activeAccounts.map((account) => {
            const amount = accountAmounts[account.id] || 0;

            return {
              ...account,
              label: account.name,
              disableDelete: amount !== 0,
              sublabel: (
                <span
                  className={amount < 0 ? classes.negative : classes.positive}
                >
                  {currencyFormat(amount)}
                </span>
              ),
            };
          })}
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
