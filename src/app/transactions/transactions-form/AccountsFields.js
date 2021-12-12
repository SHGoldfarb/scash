import React from "react";
import { bool, func } from "prop-types";
import { TextField } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useFormAccounts } from "./hooks";

const AccountsFields = ({ isTransfer, register }) => {
  const { activeAccounts, loading } = useFormAccounts();

  const defaultAccountId = activeAccounts[0]?.id;

  const optionsComponents = activeAccounts.map((account) => (
    <option value={account.id} key={account.id}>
      {account.name}
    </option>
  ));

  const originAccount = register("originAccountId");
  const destinationAccount = register("destinationAccountId");
  const account = register("accountId");

  return (
    (loading && <DelayedCircularProgress />) ||
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
          {optionsComponents}
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
          {optionsComponents}
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
        {optionsComponents}
      </TextField>
    )
  );
};

AccountsFields.propTypes = {
  isTransfer: bool.isRequired,
  register: func.isRequired,
};

export default AccountsFields;
