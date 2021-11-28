import React from "react";
import { useHistory } from "react-router-dom";
import { func, number, string } from "prop-types";
import { Button } from "@material-ui/core";
import { useReadData, useWriteData } from "../../../hooks";
import { makePath, transactionsPathName } from "../../../utils";
import { useFormCategories } from "./hooks";

const SaveButton = ({ defaultAccountId, handleSubmit, transactionType }) => {
  const history = useHistory();
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  const { activeCategories } = useFormCategories(transactionType);

  return (
    <Button
      disabled={
        !defaultAccountId ||
        (transactionType !== "transfer" && !activeCategories.length)
      }
      onClick={handleSubmit(
        async ({
          comment,
          amount,
          date,
          type,
          accountId,
          originAccountId,
          destinationAccountId,
          categoryId,
        }) => {
          const newTransaction = await upsert({
            comment,
            amount,
            date: date.toSeconds(),
            type,
            accountId: accountId
              ? parseInt(accountId, 10)
              : null || defaultAccountId,
            originAccountId: originAccountId
              ? parseInt(originAccountId, 10)
              : null || defaultAccountId,
            destinationAccountId: destinationAccountId
              ? parseInt(destinationAccountId, 10)
              : null || defaultAccountId,
            categoryId: parseInt(categoryId, 10),
          });

          update((transactions) =>
            transactions ? [...transactions, newTransaction] : transactions
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
  defaultAccountId: null,
};

SaveButton.propTypes = {
  defaultAccountId: number,
  handleSubmit: func.isRequired,
  transactionType: string.isRequired,
};

export default SaveButton;
