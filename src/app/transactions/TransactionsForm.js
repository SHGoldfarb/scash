import React, { useMemo } from "react";
import { Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useLocation, useHistory } from "react-router-dom";
import { makePath, parseSearchParams, transactionsPathName } from "utils";
import { useReadData, useWriteData } from "hooks";
import { DateTime } from "luxon";
import {
  AccountsFields,
  AmountField,
  CategoryField,
  CommentField,
  DateField,
  SaveButton,
  TypeField,
} from "./transactions-form";

// TODO: move to own file
const useCurrentTransaction = () => {
  const location = useLocation();

  const { id } = parseSearchParams(location.search);

  const { loading, data: transactions = [] } = useReadData("transactions");

  const intId = id ? parseInt(id, 10) : null;

  const transaction = useMemo(
    () => transactions.find(({ id: tid }) => tid === intId),
    [intId, transactions]
  );

  if (!id) return {};

  return { loading, ...transaction };
};

// TODO: move to own file
const DeleteButton = () => {
  const { id, date: seconds } = useCurrentTransaction();

  const date = DateTime.fromSeconds(parseInt(seconds, 10));

  const { remove } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const history = useHistory();
  return (
    <Button
      onClick={async () => {
        await remove(id);
        update((transactions) =>
          transactions.filter(({ id: tid }) => tid !== id)
        );
        history.push(
          makePath(transactionsPathName, {
            params: {
              month: date.month,
              year: date.year,
            },
          })
        );
      }}
      color="error"
    >
      Delete
    </Button>
  );
};

const TransactionsForm = () => {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm();
  const { id } = useCurrentTransaction();

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
      {id ? <DeleteButton /> : null}
    </>
  );
};

export default TransactionsForm;
