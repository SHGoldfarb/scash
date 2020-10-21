import React, { useEffect, useState } from "react";
import { Add } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { EditableField } from "../components";
import db from "../database";

const useAccounts = () => {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      const fetchedAccounts = await db.accounts.toArray();
      setAccounts(fetchedAccounts);
    };

    fetchAccounts();
  }, []);

  const deleteAccount = (idToDelete) => {
    db.accounts.delete(idToDelete);

    setAccounts(accounts.filter(({ id }) => id !== idToDelete));
  };

  const upsertAccount = async (newAccount) => {
    if (!accounts.map(({ id }) => id).includes(newAccount.id)) {
      // Is new account

      const newId = await db.accounts.add(newAccount);

      setAccounts([...accounts, { ...newAccount, id: newId }]);
    } else {
      // Is existing account
      db.accounts.update(newAccount.id, newAccount);

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
