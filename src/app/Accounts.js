import { Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { DateTime } from "luxon";
import React, { useMemo } from "react";
import { by, isClosed, isOpen } from "src/utils";
import { DelayedCircularProgress, EditableList } from "../components";
import { useData } from "../hooks";
import { currencyFormat, getTransactionsStats } from "../utils";

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
  const { loading, data: accounts = [], upsert } = useData("accounts");
  const { data: transactions = [], loading: transactionsLoading } = useData(
    "transactions"
  );

  const sortedAccounts = useMemo(() => accounts.sort(by("name")), [accounts]);

  const openAccounts = sortedAccounts.filter(isOpen);

  const closedAccounts = sortedAccounts.filter(isClosed);

  const deleteAccount = async (accountToDelete) => {
    await upsert({
      ...accountToDelete,
      closedAt: DateTime.local().toSeconds(),
    });
  };

  const upsertAccount = async (newAccount) => {
    await upsert(newAccount);
  };

  const { accountAmounts } = useMemo(() => getTransactionsStats(transactions), [
    transactions,
  ]);

  const total = Object.values(accountAmounts).reduce((a, b) => a + b, 0);

  return (
    <Root>
      <Typography variant="h5" color="textPrimary">
        Accounts
      </Typography>
      <Typography
        variant="h6"
        className={total < 0 ? classes.negative : classes.positive}
      >
        {currencyFormat(total)}
      </Typography>
      {loading || transactionsLoading ? (
        <DelayedCircularProgress />
      ) : (
        <EditableList
          source={[...openAccounts, ...closedAccounts]
            .map((account) => {
              const amount = accountAmounts[account.id] || 0;

              if (amount === 0 && account.closedAt) {
                return null;
              }

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
                onUpdate: (label) =>
                  upsertAccount({ id: account.id, name: label }),
                onRemove: () => deleteAccount(account),
                locked: !!account.closedAt,
                onUnlock: () => upsertAccount({ ...account, closedAt: null }),
              };
            })
            .filter((item) => !!item)}
          onAdd={(account) => upsertAccount({ name: account.label })}
        />
      )}
    </Root>
  );
};

export default Accounts;
