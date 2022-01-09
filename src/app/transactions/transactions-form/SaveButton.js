import React from "react";
import { useHistory } from "react-router-dom";
import { func, number, string } from "prop-types";
import { Button } from "@mui/material";
import { useReadData, useWriteData } from "../../../hooks";
import { makePath, transactionsPathName } from "../../../utils";
import { useFormAccounts, useFormCategories } from "./hooks";

// TODO: put in own file
const put = (items, itemToInsert, isEqual) => {
  const index = items.findIndex((item) => isEqual(item, itemToInsert));

  if (index === -1) {
    return [...items, itemToInsert];
  }

  return [...items.slice(0, index), itemToInsert, ...items.slice(index + 1)];
};

const SaveButton = ({ handleSubmit, transactionType, transactionId }) => {
  const history = useHistory();
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const { activeCategories } = useFormCategories(transactionType);
  const { activeAccounts } = useFormAccounts();

  const defaultAccountId = activeAccounts[0]?.id;

  return (
    <Button
      disabled={
        !activeAccounts.length ||
        (transactionType !== "transfer" && !activeCategories.length)
      }
      onClick={handleSubmit(
        async ({
          comment,
          amount,
          date,
          type,
          accountId = defaultAccountId,
          originAccountId = defaultAccountId,
          destinationAccountId = defaultAccountId,
          categoryId,
        }) => {
          const newTransaction = await upsert({
            id: transactionId,
            comment,
            amount: parseInt(amount, 10),
            date: date.toSeconds(),
            type,
            accountId: parseInt(accountId, 10),
            originAccountId: parseInt(originAccountId, 10),
            destinationAccountId: parseInt(destinationAccountId, 10),
            categoryId: parseInt(categoryId, 10),
          });

          update((transactions) =>
            put(
              transactions,
              newTransaction,
              ({ id: ida }, { id: idb }) => ida === idb
            )
          );

          history.push(makePath(transactionsPathName));
        }
      )}
    >
      Save
    </Button>
  );
};

SaveButton.defaultProps = {
  transactionId: null,
};

SaveButton.propTypes = {
  handleSubmit: func.isRequired,
  transactionType: string.isRequired,
  transactionId: number,
};

export default SaveButton;
