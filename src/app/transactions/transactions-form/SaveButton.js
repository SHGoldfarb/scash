import React from "react";
import { useHistory } from "react-router-dom";
import { func, number } from "prop-types";
import { Button } from "@material-ui/core";
import { useReadData, useWriteData } from "../../../hooks";
import { makePath, transactionsPathName } from "../../../utils";

const SaveButton = ({ defaultAccountId, handleSubmit }) => {
  const history = useHistory();
  const { upsert } = useWriteData("transactions");
  const { update } = useReadData("transactions");
  return (
    <Button
      disabled={!defaultAccountId}
      onClick={handleSubmit(
        async ({
          comment,
          amount,
          date,
          type,
          accountId,
          originAccountId,
          destinationAccountId,
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
};

export default SaveButton;
