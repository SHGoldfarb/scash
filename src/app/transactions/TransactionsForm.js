import React from "react";
import { useForm } from "react-hook-form";
import { DelayedCircularProgress } from "components";
import { useReadData } from "../../hooks";
import { isActive } from "../../utils";
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

  const { data: accounts = [], loading: accountsLoading } = useReadData(
    "accounts"
  );

  const activeAccounts = accounts.filter(isActive);

  const defaultAccountId = activeAccounts[0]?.id;

  const isTransfer = watch("type") === "transfer";

  return (
    <>
      <TypeField inputRef={register} />
      <DateField control={control} />
      <AmountField errors={errors} register={register} />
      {!accountsLoading ? (
        <AccountsFields
          isTransfer={isTransfer}
          register={register}
          defaultValue={defaultAccountId}
          accounts={activeAccounts}
        />
      ) : (
        <DelayedCircularProgress />
      )}
      <CategoryField inputRef={register} isTransfer={isTransfer} />
      <CommentField inputRef={register} />
      <SaveButton
        defaultAccountId={defaultAccountId}
        handleSubmit={handleSubmit}
      />
    </>
  );
};

export default TransactionsForm;
