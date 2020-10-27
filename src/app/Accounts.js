import React from "react";
import { EditableList } from "../components";
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
    <EditableList
      source={accounts.map((account) => ({ ...account, label: account.name }))}
      onUpdate={(account) =>
        upsertAccount({ id: account.id, name: account.label })
      }
      onAdd={(account) => upsertAccount({ name: account.label })}
      onRemove={deleteAccount}
    />
  );
};

export default Accounts;
