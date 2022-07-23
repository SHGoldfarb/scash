import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "components";
import { useFormContext } from "react-hook-form";
import { transactionTypes } from "../../../entities";
import { useFormAccounts } from "./hooks";
import { useCurrentTransaction } from "../hooks";
import { renderAccountAsMenuItem } from "./utils";

const AccountField = () => {
  const { openAccounts, closedAccounts, loading } = useFormAccounts();

  const {
    transaction = {},
    loading: transactionLoading,
  } = useCurrentTransaction();
  const { register, watch } = useFormContext();
  const [open, setOpen] = useState(false);

  const prevFieldValue = watch("type");
  const value = watch("accountId");

  useEffect(() => {
    if (prevFieldValue && !value) {
      setOpen(true);
    }
  }, [prevFieldValue, value]);

  if (
    watch("type") !== transactionTypes.income &&
    watch("type") !== transactionTypes.expense
  ) {
    return null;
  }

  const account = register("accountId");

  return (
    ((loading || transactionLoading) && <DelayedCircularProgress />) || (
      <TextField
        select
        label="Account"
        variant="filled"
        id="transaction-account"
        fullWidth
        onChange={account.onChange}
        onBlur={account.onBlur}
        name={account.name}
        inputRef={account.ref}
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
          closedAccounts.find(({ id }) => transaction[account.name] === id),
          ...openAccounts,
        ]
          .filter((item) => !!item)
          .map(renderAccountAsMenuItem)}
      </TextField>
    )
  );
};

export default AccountField;
