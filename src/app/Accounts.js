import React from "react";
import { Add } from "@material-ui/icons";
import { IconButton } from "@material-ui/core";
import { EditableField } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { upsertById } from "../utils";

const Accounts = () => {
  const { loading, data: accounts, update } = useReadData("accounts");
  const { upsert, remove } = useWriteData("accounts");

  const deleteAccount = async (idToDelete) => {
    await remove(idToDelete);
    update((currentAccounts) =>
      currentAccounts.filter(({ id }) => id !== idToDelete)
    );
  };

  const upsertAccount = async (newAccount) => {
    const returnedAccount = await upsert(newAccount);
    update((currentAccounts) => upsertById(currentAccounts, returnedAccount));
  };

  return loading ? (
    "Cargando..."
  ) : (
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
