import React from "react";
import { useHistory } from "react-router-dom";
import { Button } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useData } from "../../../hooks";
import {
  useFormAccounts,
  useFormIncomeSources,
  useFormObjectives,
} from "./hooks";
import { transactionTypes } from "../../../entities";
import { useCurrentTransaction } from "../hooks";
import { useTransactionFormContext } from "../contexts";

const SaveButton = () => {
  const history = useHistory();
  const { upsert } = useData("transactions");
  const {
    availableObjectives,
    loading: objectivesLoading,
  } = useFormObjectives();
  const {
    availableIncomeSources,
    loading: incomeSourcesLoading,
  } = useFormIncomeSources();
  const { openAccounts, loading: accountsLoading } = useFormAccounts();
  const { values } = useTransactionFormContext();
  const { transaction, loading: transactionLoading } = useCurrentTransaction();

  if (
    objectivesLoading ||
    incomeSourcesLoading ||
    accountsLoading ||
    transactionLoading
  ) {
    return <DelayedCircularProgress />;
  }

  // TODO: remove defaults
  const defaultAccountId = openAccounts[0]?.id;

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
      onClick={async () => {
        const {
          comment,
          amount,
          date,
          type,
          accountId = defaultAccountId,
          originAccountId = defaultAccountId,
          destinationAccountId = defaultAccountId,
          incomeSourceId,
          objectiveId,
        } = values;

        await upsert({
          id: transaction?.id,
          comment,
          amount: parseInt(amount, 10),
          date,
          type,
          accountId: parseInt(accountId, 10),
          originAccountId: parseInt(originAccountId, 10),
          destinationAccountId: parseInt(destinationAccountId, 10),
          incomeSourceId: parseInt(incomeSourceId, 10),
          objectiveId: parseInt(objectiveId, 10),
        });

        history.goBack();
      }}
    >
      Save
    </Button>
  );
};

export default SaveButton;
