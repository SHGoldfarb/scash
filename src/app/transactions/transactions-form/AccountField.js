import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "components";
import { transactionTypes } from "../../../entities";
import { useFormAccounts } from "./hooks";
import { useCurrentTransaction } from "../hooks";
import { renderAccountAsMenuItem } from "./utils";
import { useTransactionFormContext } from "../contexts";

const name = "accountId";

const AccountField = () => {
  const { openAccounts, closedAccounts, loading } = useFormAccounts();

  const {
    transaction = {},
    loading: transactionLoading,
  } = useCurrentTransaction();

  const {
    values: { type, accountId },
    setField,
  } = useTransactionFormContext();

  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (type && !accountId) {
      setOpen(true);
    }
  }, [type, accountId]);

  if (type !== transactionTypes.income && type !== transactionTypes.expense) {
    return null;
  }

  return loading || transactionLoading ? (
    <DelayedCircularProgress />
  ) : (
    <TextField
      select
      label="Account"
      variant="filled"
      id="transaction-account"
      fullWidth
      value={accountId || ""}
      onChange={(e) => setField(name)(e.target.value)}
      name={name}
      SelectProps={{
        open,
        onClose: () => {
          setOpen(false);
        },
        onOpen: () => {
          setOpen(true);
        },
      }}
    >
      {[
        closedAccounts.find(({ id }) => transaction[name] === id),
        ...openAccounts,
      ]
        .filter((item) => !!item)
        .map(renderAccountAsMenuItem)}
    </TextField>
  );
};

export default AccountField;
