import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "components";
import { useFormContext } from "react-hook-form";
import { transactionTypes } from "../../../entities";
import { useFormAccounts } from "./hooks";
import { useCurrentTransaction } from "../hooks";
import { renderAccountAsMenuItem } from "./utils";

const OriginAccountField = () => {
  const { openAccounts, closedAccounts, loading } = useFormAccounts();
  const { register, watch } = useFormContext();
  const {
    transaction = {},
    loading: transactionLoading,
  } = useCurrentTransaction();
  const [open, setOpen] = useState(false);

  const prevFieldValue = watch("type");
  const value = watch("originAccountId");

  useEffect(() => {
    if (prevFieldValue && !value) {
      setOpen(true);
    }
  }, [prevFieldValue, value]);

  if (watch("type") !== transactionTypes.transfer) {
    return null;
  }

  const originAccount = register("originAccountId");

  return (
    ((loading || transactionLoading) && <DelayedCircularProgress />) || (
      <TextField
        select
        label="Origin Account"
        variant="filled"
        id="transaction-origin-account"
        fullWidth
        defaultValue=""
        onChange={originAccount.onChange}
        onBlur={originAccount.onBlur}
        name={originAccount.name}
        inputRef={originAccount.ref}
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
          closedAccounts.find(
            ({ id }) => transaction[originAccount.name] === id
          ),
          ...openAccounts,
        ]
          .filter((item) => !!item)
          .map(renderAccountAsMenuItem)}
      </TextField>
    )
  );
};

export default OriginAccountField;
