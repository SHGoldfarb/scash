import React from "react";
import { bool, func } from "prop-types";
import { TextField } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useFormAccounts } from "./hooks";
import { useCurrentTransaction } from "../hooks";

const asOptionElement = (item) => (
  <option value={item.id} key={item.id}>
    {item.name}
  </option>
);

const AccountsFields = ({ isTransfer, register }) => {
  const { activeAccounts, inactiveAccounts, loading } = useFormAccounts();

  const {
    transaction = {},
    loading: transactionLoading,
  } = useCurrentTransaction();

  const defaultAccountId = activeAccounts[0]?.id;

  const originAccount = register("originAccountId");
  const destinationAccount = register("destinationAccountId");
  const account = register("accountId");

  return (
    ((loading || transactionLoading) && <DelayedCircularProgress />) ||
    (isTransfer && (
      <>
        <TextField
          select
          SelectProps={{ native: true }}
          label="Origin Account"
          variant="filled"
          id="transaction-origin-account"
          fullWidth
          defaultValue={defaultAccountId}
          onChange={originAccount.onChange}
          onBlur={originAccount.onBlur}
          name={originAccount.name}
          inputRef={originAccount.ref}
        >
          {[
            inactiveAccounts.find(
              ({ id }) => transaction[originAccount.name] === id
            ),
            ...activeAccounts,
          ]
            .filter((item) => !!item)
            .map(asOptionElement)}
        </TextField>
        <TextField
          select
          SelectProps={{ native: true }}
          label="Destination Account"
          variant="filled"
          id="transaction-destination-account"
          fullWidth
          defaultValue={defaultAccountId}
          onChange={destinationAccount.onChange}
          onBlur={destinationAccount.onBlur}
          name={destinationAccount.name}
          inputRef={destinationAccount.ref}
        >
          {[
            inactiveAccounts.find(
              ({ id }) => transaction[destinationAccount.name] === id
            ),
            ...activeAccounts,
          ]
            .filter((item) => !!item)
            .map(asOptionElement)}
        </TextField>
      </>
    )) || (
      <TextField
        select
        SelectProps={{ native: true }}
        label="Account"
        variant="filled"
        id="transaction-account"
        fullWidth
        defaultValue={defaultAccountId}
        onChange={account.onChange}
        onBlur={account.onBlur}
        name={account.name}
        inputRef={account.ref}
      >
        {[
          inactiveAccounts.find(({ id }) => transaction[account.name] === id),
          ...activeAccounts,
        ]
          .filter((item) => !!item)
          .map(asOptionElement)}
      </TextField>
    )
  );
};

AccountsFields.propTypes = {
  isTransfer: bool.isRequired,
  register: func.isRequired,
};

export default AccountsFields;
