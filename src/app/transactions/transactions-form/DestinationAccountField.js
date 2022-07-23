import React, { useEffect, useState } from "react";
import { DelayedCircularProgress, TextField } from "components";
import { useFormAccounts } from "./hooks";
import { useCurrentTransaction } from "../hooks";
import { renderAccountAsMenuItem } from "./utils";
import { transactionTypes } from "../../../entities";
import { useTransactionFormContext } from "../contexts";

const name = "destinationAccountId";

const DestinationAccountField = () => {
  const { openAccounts, closedAccounts, loading } = useFormAccounts();
  const {
    values: { originAccountId, destinationAccountId, type },
    setField,
  } = useTransactionFormContext();

  const {
    transaction = {},
    loading: transactionLoading,
  } = useCurrentTransaction();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (originAccountId && !destinationAccountId) {
      setOpen(true);
    }
  }, [originAccountId, destinationAccountId]);

  if (type !== transactionTypes.transfer) {
    return null;
  }

  return loading || transactionLoading ? (
    <DelayedCircularProgress />
  ) : (
    <TextField
      select
      label="Destination Account"
      variant="filled"
      id="transaction-destination-account"
      fullWidth
      onChange={(e) => setField(name)(e.target.value)}
      name={name}
      value={destinationAccountId || ""}
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

export default DestinationAccountField;
