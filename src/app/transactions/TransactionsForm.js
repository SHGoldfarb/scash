import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DateTime } from "luxon";
import { DelayedCircularProgress } from "components";
import {
  AccountsFields,
  AmountField,
  CategoryField,
  CommentField,
  DateField,
  DeleteButton,
  SaveButton,
  TypeField,
} from "./transactions-form";
import { useCurrentTransaction } from "./hooks";

const TransactionsForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
    reset,
  } = useForm();

  const { transaction, loading } = useCurrentTransaction();

  useEffect(() => {
    if (transaction) {
      reset({
        comment: transaction.comment,
        amount: transaction.amount,
        date: DateTime.fromSeconds(transaction.date),
        type: transaction.type,
        accountId: transaction.accountId,
        originAccountId: transaction.originAccountId,
        destinationAccountId: transaction.destinationAccountId,
        categoryId: transaction.categoryID,
      });
    }
  }, [transaction, reset]);

  if (loading) {
    return <DelayedCircularProgress />;
  }

  // TODO: default value for transaction type should only be defined in one place
  const transactionType = watch("type") || "expense";

  return (
    <>
      <TypeField register={register} />
      <DateField control={control} />
      <AmountField errors={errors} register={register} />
      <AccountsFields
        isTransfer={transactionType === "transfer"}
        register={register}
      />
      <CategoryField register={register} transactionType={transactionType} />
      <CommentField register={register} />
      <SaveButton
        handleSubmit={handleSubmit}
        transactionType={transactionType}
      />
      {(transaction && (
        <DeleteButton
          transactionId={transaction.id}
          transactionDate={transaction.date}
        />
      )) ||
        null}
    </>
  );
};

export default TransactionsForm;
