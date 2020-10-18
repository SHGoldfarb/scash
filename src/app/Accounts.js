import React, { useState } from "react";
import { Add } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { EditableField } from "../components";

const useAccounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, name: "Cash" },
    { id: 2, name: "Bank" },
  ]);

  const newId = () => accounts.reduce((a, b) => Math.max(a, b.id), 1) + 1;

  const deleteAccount = (idToDelete) =>
    setAccounts(accounts.filter(({ id }) => id !== idToDelete));

  const upsertAccount = (newAccount) => {
    if (!accounts.map(({ id }) => id).includes(newAccount.id)) {
      // Is new account
      setAccounts([
        ...accounts,
        { ...newAccount, id: newAccount.id || newId() },
      ]);
    } else {
      // Is existing account
      setAccounts(
        accounts.map((oldAccount) =>
          oldAccount.id === newAccount.id
            ? { ...oldAccount, ...newAccount }
            : oldAccount
        )
      );
    }
  };

  return [accounts, deleteAccount, upsertAccount];
};

const Accounts = () => {
  const [accounts, deleteAccount, upsertAccount] = useAccounts();
  return (
    <div>
      <pre>{JSON.stringify(accounts, null, 2)}</pre>
      {accounts.map((account) => (
        <EditableField
          key={account.id}
          value={account.name}
          onDelete={() => deleteAccount(account.id)}
          onChange={(name) => upsertAccount({ ...account, name })}
        />
      ))}
      <IconButton
        aria-label="Create"
        onClick={() => upsertAccount({ name: "New Account" })}
      >
        <Add color="primary" />
      </IconButton>
    </div>
  );
};

export default Accounts;
