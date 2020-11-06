import { Typography } from "@material-ui/core";
import { DateTime } from "luxon";
import React from "react";
import { EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { upsertById } from "../utils";

const Accounts = () => {
  const { loading, data: accounts = [], update } = useReadData("accounts");
  const { upsert } = useWriteData("accounts");

  const deleteAccount = async (accountToDelete) => {
    const returnedAccount = await upsert({
      ...accountToDelete,
      deactivatedAt: DateTime.local().toSeconds(),
    });
    update((currentAccounts) => upsertById(currentAccounts, returnedAccount));
  };

  const upsertAccount = async (newAccount) => {
    const returnedAccount = await upsert(newAccount);
    update((currentAccounts) => upsertById(currentAccounts, returnedAccount));
  };

  const activeAccounts = accounts.filter((account) => !account.deactivatedAt);

  return (
    <>
      <Typography variant="h5">Accounts</Typography>

      {loading ? (
        "Cargando..."
      ) : (
        <EditableList
          source={activeAccounts.map((account) => ({
            ...account,
            label: account.name,
          }))}
          onUpdate={(account) =>
            upsertAccount({ id: account.id, name: account.label })
          }
          onAdd={(account) => upsertAccount({ name: account.label })}
          onRemove={deleteAccount}
        />
      )}
    </>
  );
};

export default Accounts;
