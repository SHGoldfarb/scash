import React from "react";
import { bool, func } from "prop-types";
import { TextField } from "@material-ui/core";
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

  return (
    (loading && <DelayedCircularProgress />) ||
    (isTransfer && (
      <>
        <TextField
          select
          SelectProps={{ native: true }}
          label="Origin Account"
          variant="filled"
          name="originAccountId"
          inputRef={register}
          id="transaction-origin-account"
          fullWidth
          defaultValue={defaultAccountId}
        >
          {optionsComponents}
        </TextField>
        <TextField
          select
          SelectProps={{ native: true }}
          label="Destination Account"
          variant="filled"
          name="destinationAccountId"
          inputRef={register}
          id="transaction-destination-account"
          fullWidth
          defaultValue={defaultAccountId}
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
        name="accountId"
        inputRef={register}
        id="transaction-account"
        fullWidth
        defaultValue={defaultAccountId}
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
