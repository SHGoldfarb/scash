import React from "react";
import { arrayOf, bool, func, number, shape } from "prop-types";
import { TextField } from "@material-ui/core";

const AccountsFields = ({ isTransfer, register, defaultValue, accounts }) => {
  const optionsComponents = accounts.map((account) => (
    <option value={account.id} key={account.id}>
      {account.name}
    </option>
  ));

  return isTransfer ? (
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
        defaultValue={defaultValue}
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
        defaultValue={defaultValue}
      >
        {optionsComponents}
      </TextField>
    </>
  ) : (
    <TextField
      select
      SelectProps={{ native: true }}
      label="Account"
      variant="filled"
      name="accountId"
      inputRef={register}
      id="transaction-account"
      fullWidth
      defaultValue={defaultValue}
    >
      {optionsComponents}
    </TextField>
  );
};

AccountsFields.defaultProps = {
  defaultValue: null,
};

AccountsFields.propTypes = {
  isTransfer: bool.isRequired,
  register: func.isRequired,
  defaultValue: number,
  accounts: arrayOf(shape({})).isRequired,
};

export default AccountsFields;
