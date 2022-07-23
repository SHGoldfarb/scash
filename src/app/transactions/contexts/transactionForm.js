import React, { createContext, useContext, useState } from "react";
import { DelayedCircularProgress } from "components";
import { useLocation } from "react-router-dom";
import { DateTime } from "luxon";
import { node } from "prop-types";
import { useCurrentTransaction } from "../hooks";
import { parseSearchParams } from "../../../utils";

const useDefaultDate = () => {
  const location = useLocation();

  const { month, year, day } = parseSearchParams(location.search);

  const currentDate = DateTime.now();

  if (month && year && day) {
    return DateTime.fromObject({
      year,
      month,
      day,
      hour: currentDate.hour,
      minute: currentDate.minute,
      second: currentDate.second,
    });
  }

  if (`${currentDate.month}` === month && `${currentDate.year}` === year) {
    // selected month is today's month
    return currentDate;
  }

  const selectedDate = DateTime.fromObject({ month, year });

  if (currentDate > selectedDate) {
    // selected month is a past month
    return selectedDate.endOf("month");
  }

  // selected month is a future month

  return selectedDate.startOf("month");
};

const TransactionFormContext = createContext();

export const TransactionFormProvider = ({ children }) => {
  const defaultDate = useDefaultDate();
  const [formValues, setFormValues] = useState({});

  const { transaction, loading } = useCurrentTransaction();

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const setField = (fieldName) => (value) =>
    setFormValues((prevValues) => ({ ...prevValues, [fieldName]: value }));

  const values = {
    date: defaultDate.toSeconds(),
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
