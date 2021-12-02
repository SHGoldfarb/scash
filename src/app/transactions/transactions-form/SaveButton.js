import React from "react";
import { useHistory } from "react-router-dom";
import { func, string } from "prop-types";
import { Button } from "@material-ui/core";
import { useReadData, useWriteData } from "../../../hooks";
import { makePath, transactionsPathName } from "../../../utils";
import { useFormAccounts, useFormCategories } from "./hooks";

const SaveButton = ({ handleSubmit, transactionType }) => {
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

SaveButton.propTypes = {
  handleSubmit: func.isRequired,
  transactionType: string.isRequired,
};

export default SaveButton;
