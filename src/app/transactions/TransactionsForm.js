import React from "react";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";
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
import { TransactionFormProvider } from "./contexts";

const TransactionsForm = () => {
  const history = useHistory();

  return (
    <TransactionFormProvider>
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
    </TransactionFormProvider>
  );
};

export default TransactionsForm;
