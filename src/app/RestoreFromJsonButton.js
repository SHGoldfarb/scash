import React from "react";
import { Button } from "@mui/material";
import { useData } from "src/hooks";
import { importFromJSON } from "src/utils";

const readAsText = (file) =>
  new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      resolve(e.target.result);
    };
    reader.readAsText(file);
  });

const handleFileSelect = async (event) => {
  const file = event.target.files && event.target.files[0];
  if (!file) {
    // eslint-disable-next-line no-console
    console.warn("No file selected?");
    return;
  }

  const data = await readAsText(file);

  await importFromJSON(data);
};

const RestoreFromJsonButton = () => {
  const { refetch: refetchAccounts } = useData("accounts");
  const { refetch: refetchObjectives } = useData("objectives");
  const { refetch: refetchIncomeSources } = useData("incomeSources");
  const { refetch: refetchTransactions } = useData("transactions");
  return (
    <Button component="label">
      Import from JSON
      <input
        type="file"
        hidden
        onChange={async (ev) => {
          await handleFileSelect(ev);

          refetchAccounts();
          refetchObjectives();
          refetchIncomeSources();
          refetchTransactions();
        }}
      />
    </Button>
  );
};

export default RestoreFromJsonButton;
