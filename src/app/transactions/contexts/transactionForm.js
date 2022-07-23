import React, { createContext, useContext, useState } from "react";
import { DelayedCircularProgress } from "src/components";
import { node } from "prop-types";
import { useHistory } from "react-router-dom";
import { useData } from "src/hooks";
import { useCurrentTransaction } from "../hooks";
import { useDefaultDate } from "./transaction-form";

const TransactionFormContext = createContext();

export const TransactionFormProvider = ({ children }) => {
  const defaultDate = useDefaultDate();
  const [persistentDefaultDate] = useState(defaultDate);
  const [formValues, setFormValues] = useState({});
  const history = useHistory();
  const { transaction, loading } = useCurrentTransaction();
  const { upsert } = useData("transactions");

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const setField = (fieldName) => (value) =>
    setFormValues((prevValues) => ({ ...prevValues, [fieldName]: value }));

  const values = {
    date: persistentDefaultDate.toSeconds(),
    ...transaction,
    ...formValues,
  };

  const handleSubmit = async () => {
    const {
      comment,
      amount,
      date,
      type,
      accountId,
      originAccountId,
      destinationAccountId,
      incomeSourceId,
      objectiveId,
    } = values;

    // TODO: Validate!

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
  };

  return (
    <TransactionFormContext.Provider value={{ values, setField, handleSubmit }}>
      {children}
    </TransactionFormContext.Provider>
  );
};

TransactionFormProvider.propTypes = {
  children: node.isRequired,
};

export const useTransactionFormContext = () =>
  useContext(TransactionFormContext);
