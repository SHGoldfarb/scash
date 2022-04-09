import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { DelayedCircularProgress, EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { currencyFormat, getTransactionsStats, upsertById } from "../utils";

const PREFIX = "Accounts";

const classes = {
  positive: `${PREFIX}-positive`,
  negative: `${PREFIX}-negative`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.positive}`]: {
    color: theme.palette.success.light,
  },

  [`& .${classes.negative}`]: {
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
      closedAt: DateTime.local().toSeconds(),
    });
    update((currentAccounts) => upsertById(currentAccounts, returnedAccount));
  };

  const upsertAccount = async (newAccount) => {
    const returnedAccount = await upsert(newAccount);
    update((currentAccounts) => upsertById(currentAccounts, returnedAccount));
  };

  const activeAccounts = accounts.filter((account) => !account.closedAt);

  const { accountAmounts } = useMemo(() => getTransactionsStats(transactions), [
    transactions,
  ]);

  return (
    <Root>
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
    </Root>
  );
};

export default Accounts;
