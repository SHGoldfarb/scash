import React, { useEffect } from "react";

import { DelayedCircularProgress } from "components";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import {
  AmountField,
  IncomeSourceField,
  CommentField,
  DateField,
  DeleteButton,
  ObjectiveField,
  SaveButton,
  TypeField,
  AccountField,
  OriginAccountField,
  DestinationAccountField,
} from "./transactions-form";
import { useCurrentTransaction } from "./hooks";

const TransactionsForm = () => {
  const history = useHistory();

  const { reset, watch, ...methods } = useForm();

  const { transaction, loading } = useCurrentTransaction();

  useEffect(() => {
    if (transaction) {
      reset({
        comment: transaction.comment,
        amount: transaction.amount,
        date: transaction.date,
        type: transaction.type,
        accountId: transaction.accountId,
        originAccountId: transaction.originAccountId,
        destinationAccountId: transaction.destinationAccountId,
        objectiveId: transaction.objectiveId,
        incomeSourceId: transaction.incomeSourceId,
      });
    }
  }, [transaction, reset]);

  // Transaction exists and values are still being set
  const stillLoading = transaction && watch("type") === undefined;

  if (loading || stillLoading) {
    return <DelayedCircularProgress />;
  }

  return (
    <FormProvider reset={reset} watch={watch} {...methods}>
      <DateField />
      <TypeField />
      <OriginAccountField />
      <DestinationAccountField />
      <AccountField />
      <IncomeSourceField />
      <ObjectiveField />
      <AmountField />
      <CommentField />
      <Button
        onClick={() => {
          history.goBack();
        }}
      >
        Back
      </Button>
      <DeleteButton />
      <SaveButton />
    </FormProvider>
  );
};

export default TransactionsForm;
