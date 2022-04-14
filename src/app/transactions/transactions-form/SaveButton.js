import React from "react";
import { useHistory } from "react-router-dom";
import { func, number, string } from "prop-types";
import { Button } from "@mui/material";
import { DelayedCircularProgress } from "components";
import { useReadData, useWriteData } from "../../../hooks";
import { makePath, transactionsPathName } from "../../../utils";
import {
  useFormAccounts,
  useFormIncomeSources,
  useFormObjectives,
} from "./hooks";

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
  const {
    availableObjectives,
    loading: objectivesLoading,
  } = useFormObjectives();
  const {
    availableIncomeSources,
    loading: incomeSourcesLoading,
  } = useFormIncomeSources();
  const { openAccounts, loading: accountsLoading } = useFormAccounts();

  if (objectivesLoading || incomeSourcesLoading || accountsLoading) {
    return <DelayedCircularProgress />;
  }

  const defaultAccountId = openAccounts[0]?.id;

  return (
    <Button
      disabled={
        !openAccounts.length ||
        (transactionType === "income" && !availableIncomeSources.length) ||
        (transactionType === "expense" && !availableObjectives.length)
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
          incomeSourceId,
          objectiveId,
        }) => {
          const newTransaction = await upsert({
            id: transactionId,
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
