import React, { useMemo } from "react";
import { shape, bool, arrayOf } from "prop-types";
import { DateTime } from "luxon";
import { by } from "utils";
import { reversed } from "lib";
import { PaginatedTransactionsByDate } from "./transactions-list";
import { TransactionsDateCards } from "./transactions-list/components";
import { MAX_DATES_PER_PAGE } from "./transactions-list/utils";

const TransactionsList = ({ transactions, paginated }) => {
  const transactionsByDate = useMemo(() => {
    const dates = {};
    transactions.sort(by("date")).forEach((transaction) => {
      const date = DateTime.fromSeconds(transaction.date).toFormat(
        "yyyy-MM-dd"
      );
      if (!dates[date]) {
        dates[date] = [];
      }

      dates[date].push(transaction);
    });

    return dates;
  }, [transactions]);

  const dates = useMemo(
    () => reversed(Object.keys(transactionsByDate).sort()),
    [transactionsByDate]
  );

  const shouldPaginate = paginated && dates.length > MAX_DATES_PER_PAGE;

  return shouldPaginate ? (
    <PaginatedTransactionsByDate
      transactionsByDate={transactionsByDate}
      sortedDates={dates}
    />
  ) : (
    <TransactionsDateCards
      dates={dates}
      getSortedTransactions={(date) => transactionsByDate[date]}
    />
  );
};

TransactionsList.defaultProps = {
  paginated: false,
};

TransactionsList.propTypes = {
  transactions: arrayOf(shape()).isRequired,
  paginated: bool,
};

export default TransactionsList;
