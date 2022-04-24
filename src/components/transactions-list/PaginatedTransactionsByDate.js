import React, { useState } from "react";
import { Typography } from "@mui/material";
import { shape, arrayOf, string } from "prop-types";
import { useUrlParams } from "hooks";
import { TransactionsDateCards } from "./components";
import { PagesNavigation } from "./paginated-transactions-by-date";
import { MAX_DATES_PER_PAGE } from "./utils";

const usePagination = ({
  items,
  size,
  withUrlParams = false,
  urlParamsKey = "pageIndex",
}) => {
  const [currentPageIndexState, setCurrentPageIndexState] = useState(0);

  const {
    params: { [urlParamsKey]: currentPageIndexUrl },
    replace,
  } = useUrlParams();

  const currentPageIndex = withUrlParams
    ? parseInt(currentPageIndexUrl || "0", 10)
    : currentPageIndexState;

  const setCurrentPageIndex = withUrlParams
    ? (getNewIndex) =>
        replace({ [urlParamsKey]: getNewIndex(currentPageIndex) })
    : setCurrentPageIndexState;

  const pagesAmount = Math.ceil(items.length / size);
  const startIndex = currentPageIndex * size;
  const endIndex = (currentPageIndex + 1) * size;

  return {
    pageItems: items.slice(startIndex, endIndex),
    pageIndex: currentPageIndex,
    totalPages: pagesAmount,
    handlePageUp: () =>
      setCurrentPageIndex((i) => Math.min(i + 1, pagesAmount - 1)),
    handlePageDown: () => setCurrentPageIndex((i) => Math.max(i - 1, 0)),
  };
};

const PaginatedTransactionsByDate = ({ transactionsByDate, sortedDates }) => {
  const {
    pageItems,
    pageIndex,
    totalPages,
    handlePageUp,
    handlePageDown,
  } = usePagination({
    items: sortedDates,
    size: MAX_DATES_PER_PAGE,
    withUrlParams: true,
  });

  return (
    <>
      <PagesNavigation
        handleNavigateBefore={handlePageUp}
        handleNavigateNext={handlePageDown}
        middleContent={
          <Typography sx={{ margin: "auto" }} color="textPrimary">{`${
            totalPages - pageIndex
          }/${totalPages}`}</Typography>
        }
      />
      <TransactionsDateCards
        dates={pageItems}
        getSortedTransactions={(date) => transactionsByDate[date]}
      />
    </>
  );
};

PaginatedTransactionsByDate.propTypes = {
  transactionsByDate: shape().isRequired,
  sortedDates: arrayOf(string).isRequired,
};

export default PaginatedTransactionsByDate;
