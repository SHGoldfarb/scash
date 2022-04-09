import { Typography } from "@mui/material";
import { DateTime } from "luxon";
import React from "react";
import { DelayedCircularProgress, EditableList } from "../components";
import { useReadData, useWriteData } from "../hooks";
import { upsertById } from "../utils";

const IncomeCategories = () => {
  const { loading, data: incomeCategories = [], update } = useReadData(
    "incomeCategories"
  );
  const { upsert } = useWriteData("incomeCategories");

  const deleteCategory = async (categoryToDelete) => {
    const returnedCategory = await upsert({
      ...categoryToDelete,
      closedAt: DateTime.local().toSeconds(),
    });
    update((currentCategories) =>
      upsertById(currentCategories, returnedCategory)
    );
  };

  const upsertCategory = async (newCategory) => {
    const returnedCategory = await upsert(newCategory);
    update((currentCategories) =>
      upsertById(currentCategories, returnedCategory)
    );
  };

  const openCategories = incomeCategories.filter(
    (category) => !category.closedAt
  );

  return (
    <>
      <Typography variant="h5" color="textPrimary">
        Income Categories
      </Typography>

      {loading ? (
        <DelayedCircularProgress />
      ) : (
        <EditableList
          source={openCategories.map((category) => ({
            ...category,
            label: category.name,
            onUpdate: (label) =>
              upsertCategory({ id: category.id, name: label }),
            onRemove: () => deleteCategory(category),
          }))}
          onAdd={(category) => upsertCategory({ name: category.label })}
        />
      )}
    </>
  );
};

export default IncomeCategories;
