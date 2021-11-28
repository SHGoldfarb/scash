import React from "react";
import { useForm } from "react-hook-form";
import {
  AccountsFields,
  AmountField,
  CategoryField,
  CommentField,
  DateField,
  SaveButton,
  TypeField,
} from "./transactions-form";

const TransactionsForm = () => {
  const { register, handleSubmit, errors, control, watch } = useForm();

  // TODO: default value for transaction type should only be defined in one place
  const transactionType = watch("type") || "expense";

  return (
    <>
      <TypeField inputRef={register} />
      <DateField control={control} />
      <AmountField errors={errors} register={register} />

      <AccountsFields
        isTransfer={transactionType === "transfer"}
        register={register}
      />

      <CategoryField inputRef={register} transactionType={transactionType} />
      <CommentField inputRef={register} />
      <SaveButton
        handleSubmit={handleSubmit}
        transactionType={transactionType}
      />
    </>
  );
};

export default TransactionsForm;
