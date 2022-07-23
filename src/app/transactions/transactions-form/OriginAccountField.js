import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "src/components";
import { transactionTypes } from "src/entities";
import { useFormAccounts } from "./hooks";
import { useCurrentTransaction } from "../hooks";
import { renderAccountAsMenuItem } from "./utils";
import { useTransactionFormContext } from "../contexts";

const name = "originAccountId";

const OriginAccountField = () => {
  const { openAccounts, closedAccounts, loading } = useFormAccounts();
  const {
    values: { type, originAccountId },
    setField,
  } = useTransactionFormContext();
  const {
    transaction = {},
    loading: transactionLoading,
  } = useCurrentTransaction();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (type && !originAccountId) {
      setOpen(true);
    }
  }, [type, originAccountId]);

  if (type !== transactionTypes.transfer) {
    return null;
  }

  return (
    ((loading || transactionLoading) && <DelayedCircularProgress />) || (
      <TextField
        select
        label="Origin Account"
        variant="filled"
        id="transaction-origin-account"
        fullWidth
        value={originAccountId || ""}
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
    )
  );
};

export default OriginAccountField;
