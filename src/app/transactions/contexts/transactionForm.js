import React, { createContext, useContext, useState } from "react";
import { DelayedCircularProgress } from "components";
import { node } from "prop-types";
import { useCurrentTransaction } from "../hooks";
import { useDefaultDate } from "./transaction-form";

const TransactionFormContext = createContext();

export const TransactionFormProvider = ({ children }) => {
  const defaultDate = useDefaultDate();
  const [date] = useState(defaultDate);
  const [formValues, setFormValues] = useState({});

  const { transaction, loading } = useCurrentTransaction();

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const setField = (fieldName) => (value) =>
    setFormValues((prevValues) => ({ ...prevValues, [fieldName]: value }));

  const values = {
    date: date.toSeconds(),
    ...transaction,
    ...formValues,
  };

  return (
    <TransactionFormContext.Provider value={{ values, setField }}>
      {children}
    </TransactionFormContext.Provider>
  );
};

TransactionFormProvider.propTypes = {
  children: node.isRequired,
};

export const useTransactionFormContext = () =>
  useContext(TransactionFormContext);
