import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { DelayedCircularProgress } from "components";
import {
  AccountsFields,
  AmountField,
  IncomeSourceField,
  CommentField,
  DateField,
  DeleteButton,
  ObjectiveField,
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
      {(transactionType === "income" && (
        <IncomeSourceField register={register} />
      )) ||
        (transactionType === "expense" && (
          <ObjectiveField register={register} />
        )) ||
        null}

      <CommentField register={register} />
      <SaveButton
        handleSubmit={handleSubmit}
        transactionType={transactionType}
        transactionId={transaction?.id}
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
