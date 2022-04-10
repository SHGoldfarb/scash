import React from "react";
import { number } from "prop-types";
import { DateTime } from "luxon";
import { useReadData, useWriteData } from "hooks";
import { DelayedCircularProgress } from "components";
import { upsertById } from "utils";
import { Item } from "./components";

const ObjectiveItem = ({ categoryId, amount }) => {
  const { dataHash: categoriesHash = {}, update, loading } = useReadData(
    "categories"
  );
  const { upsert } = useWriteData("categories");

  const handleUpdate = async (newCategory) => {
    const returnedCategory = await upsert(newCategory);
    update((categories) => upsertById(categories, returnedCategory));
  };

  if (loading) {
    return <DelayedCircularProgress />;
  }

  const category = categoriesHash[categoryId];

  if (category.closedAt && amount === 0) {
    return null;
  }

  return (
    <Item
      label={category.name}
      amount={amount}
      onNameChange={(newName) => handleUpdate({ ...category, name: newName })}
      onClose={() => handleUpdate({ ...category, closedAt: DateTime.local() })}
      onOpen={() => handleUpdate({ ...category, closedAt: undefined })}
      closed={!!category.closedAt}
      onAmountChange={(amountChange) =>
        handleUpdate({
          ...category,
          assignedAmount: category.assignedAmount + amountChange,
        })
      }
    />
  );
};

ObjectiveItem.propTypes = {
  categoryId: number.isRequired,
  amount: number.isRequired,
};

export default ObjectiveItem;
