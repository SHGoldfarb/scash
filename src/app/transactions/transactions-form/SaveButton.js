import React from "react";
import { Button } from "@mui/material";
import { DelayedCircularProgress } from "components";
import {
  useFormAccounts,
  useFormIncomeSources,
  useFormObjectives,
} from "./hooks";
import { transactionTypes } from "../../../entities";
import { useTransactionFormContext } from "../contexts";

const SaveButton = () => {
  const {
    availableObjectives,
    loading: objectivesLoading,
  } = useFormObjectives();
  const {
    availableIncomeSources,
    loading: incomeSourcesLoading,
  } = useFormIncomeSources();
  const { openAccounts, loading: accountsLoading } = useFormAccounts();
  const { values, handleSubmit } = useTransactionFormContext();

  if (objectivesLoading || incomeSourcesLoading || accountsLoading) {
    return <DelayedCircularProgress />;
  }

  return (
    <Button
      sx={{ margin: 1 }}
      variant="contained"
      disabled={
        !openAccounts.length ||
        (values.type === transactionTypes.income &&
          !availableIncomeSources.length) ||
        (values.type === transactionTypes.expense &&
          !availableObjectives.length) ||
        !values.type
      }
      onClick={handleSubmit}
    >
      Save
    </Button>
  );
};

export default SaveButton;
