import React from "react";
import { Button } from "@mui/material";
import { useReadData, useWriteData } from "hooks";
import { importJSON } from "utils";

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

  await importJSON(data);
};

const RestoreFromJsonButton = () => {
  const { clear: clearAccounts } = useWriteData("accounts");
  const { clear: clearCategories } = useWriteData("categories");
  const { clear: clearIncomeCategories } = useWriteData("incomeCategories");
  const { clear: clearTransactions } = useWriteData("transactions");

  const { refetch: refetchAccounts } = useReadData("accounts");
  const { refetch: refetchCategories } = useReadData("categories");
  const { refetch: refetchIncomeCategories } = useReadData("incomeCategories");
  const { refetch: refetchTransactions } = useReadData("transactions");
  return (
    <Button component="label">
      Import from JSON
      <input
        type="file"
        hidden
        onChange={async (ev) => {
          await clearAccounts();
          await clearCategories();
          await clearIncomeCategories();
          await clearTransactions();

          await handleFileSelect(ev);

          refetchAccounts();
          refetchCategories();
          refetchIncomeCategories();
          refetchTransactions();
        }}
      />
    </Button>
  );
};

export default RestoreFromJsonButton;
