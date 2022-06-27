import React from "react";
import { Card, CardContent, CardHeader } from "@mui/material";
import { arrayOf, shape } from "prop-types";
import { DateTime } from "luxon";
import {
  editPathName,
  isEnterKey,
  makePath,
  transactionsPathName,
} from "utils";
import { useHistory } from "react-router-dom";
import { TransactionInfo } from "./transactions-date-card";

const TransactionsDateCard = ({ sortedTransactions }) => {
  const history = useHistory();

  const date = DateTime.fromSeconds(sortedTransactions[0].date);

  const handleDateClick = () => {
    history.push(
      makePath(transactionsPathName, editPathName, {
        params: {
          month: date.month,
          year: date.year,
          day: date.day,
        },
      })
    );
  };

  return (
    <Card
      sx={{
        margin: 1,
      }}
    >
      <div
        onClick={handleDateClick}
        onKeyPress={(ev) => {
          if (isEnterKey(ev)) {
            handleDateClick();
          }
        }}
        role="button"
        tabIndex={0}
      >
        <CardHeader
          title={date.toFormat("ccc dd")}
          subheader={date.toFormat("MMMM yyyy")}
          sx={{
            "& > .MuiCardHeader-content": {
              display: "flex",
              alignItems: "baseline",
            },
          }}
          subheaderTypographyProps={{ sx: { marginLeft: 1 } }}
        />
      </div>
      <CardContent sx={{ "&:last-child": { paddingBottom: 2 }, paddingTop: 0 }}>
        {sortedTransactions.map((transaction) => (
          <TransactionInfo transaction={transaction} key={transaction.id} />
        ))}
      </CardContent>
    </Card>
  );
};

TransactionsDateCard.propTypes = {
  sortedTransactions: arrayOf(shape()).isRequired,
};

export default TransactionsDateCard;
