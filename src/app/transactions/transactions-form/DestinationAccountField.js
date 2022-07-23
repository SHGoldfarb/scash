import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "components";
import { useFormContext } from "react-hook-form";
import { useFormAccounts } from "./hooks";
import { useCurrentTransaction } from "../hooks";
import { renderAccountAsMenuItem } from "./utils";
import { transactionTypes } from "../../../entities";

const DestinationAccountField = () => {
  const { openAccounts, closedAccounts, loading } = useFormAccounts();
  const { register, watch } = useFormContext();

  const {
    transaction = {},
    loading: transactionLoading,
  } = useCurrentTransaction();
  const [open, setOpen] = useState(false);

  const prevFieldValue = watch("originAccountId");
  const value = watch("destinationAccountId");

  useEffect(() => {
    if (prevFieldValue && !value) {
      setOpen(true);
    }
  }, [prevFieldValue, value]);

  if (watch("type") !== transactionTypes.transfer) {
    return null;
  }

  const destinationAccount = register("destinationAccountId");

  return (
    ((loading || transactionLoading) && <DelayedCircularProgress />) || (
      <TextField
        select
        label="Destination Account"
        variant="filled"
        id="transaction-destination-account"
        fullWidth
        onChange={destinationAccount.onChange}
        onBlur={destinationAccount.onBlur}
        name={destinationAccount.name}
        inputRef={destinationAccount.ref}
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
            ({ id }) => transaction[destinationAccount.name] === id
          ),
          ...openAccounts,
        ]
          .filter((item) => !!item)
          .map(renderAccountAsMenuItem)}
      </TextField>
    )
  );
};

export default DestinationAccountField;
